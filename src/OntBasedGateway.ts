import * as _ from 'lodash';
import axios from 'axios';
import {
  BigNumber,
  Block,
  BlockHeader,
  GenericTransactions,
  getLogger, implement,
  IOntRawTransaction,
  IToken,
  Transaction,
  Transactions,
  TransactionStatus,
  Utils,
  ICurrency,
  IRawVOut,
  ISubmittedTransaction,
  OntTransaction,
  AccountBasedGateway
} from '..';
import {IRawTransaction} from './interfaces';

const logger = getLogger('OntBasedGateway');
const _cacheBlockNumber = {
  value: 0,
  updatedAt: 0,
  isRequesting: false,
};

/**
 * Restful api
 */
const pathUrlRestApi = {
  getBlockCount: `/api/v1/block/height`,
  getBlockNumber: `/api/v1/block/details/height/`,
  getOneTransaction: '/api/v1/transaction/',
  getAllBlockTransactions: '/api/v1/block/details/height/',
  getGasPrice: '/api/v1/gasprice',
  getBalance: '/api/v1/balance/',
  sendRawTx: '/api/v1/transaction',
};

const pathUrlExplorerApi = {
  getLatestBlock: '/v2/latest-blocks?count=1',
  getLatestBlocks: '/v2/latest-blocks?count=',
  getBlockDetail: '/v2/blocks/', //block height or block hash
  getTxDetail: '/v2/transactions/', //tx_hash
};

const GasLimit = 20000;
const GasPrice = 2500;

export abstract class OntBasedGateway extends AccountBasedGateway {
  protected _currency: IToken;
  protected _explorerEndpoint: any;
  protected _explorerApi: any;
  protected _restEndpoint: any;
  protected _restApi: any;

  public constructor(currency: IToken, url?: any) {
    super(currency);
    const config = this.getCurrencyConfig();
    // REST API
    this._restEndpoint = config.restEndpoint;
    if (url) {
      this._restApi = url;
    } else {
      this._restApi = pathUrlRestApi;
    }
    // Explorer API
    this._explorerEndpoint = config.explorerEndpoint;
    this._explorerApi = pathUrlExplorerApi;
  }

  /**
   * No param
   * Returns the number of blocks in the local best block chain.
   * @returns {number}: the height of latest block on the block chain
   */
  public async getBlockCount(): Promise<number> {
    const now = Utils.nowInMillis();
    const CACHE_TIME = 10000;
    if (_cacheBlockNumber.value > 0 && now - _cacheBlockNumber.updatedAt < CACHE_TIME) {
      return _cacheBlockNumber.value;
    }

    if (_cacheBlockNumber.isRequesting) {
      await Utils.timeout(500);
      return this.getBlockCount();
    }

    _cacheBlockNumber.isRequesting = true;

    // Since there're some cases that newest block is not fully broadcsted to the network
    // We decrease lastest block number by 1 for safety
    let blockHeight: number;
    try {
      const response = await axios.get(`${this._restEndpoint}${this._restApi.getBlockCount}`);
      blockHeight = response.data.Result;
    } catch (err) {
      logger.error(err);
      blockHeight = _cacheBlockNumber.value;
    }

    const newUpdateAt = Utils.nowInMillis();
    _cacheBlockNumber.value = blockHeight;
    _cacheBlockNumber.updatedAt = newUpdateAt;
    _cacheBlockNumber.isRequesting = false;
    logger.debug(`OntBasedGateway::getBlockCount value=${blockHeight} updateAt=${newUpdateAt}`);
    return blockHeight;
  }

  /**
   * Returns all transaction in given block
   *
   * @param {number} blockHeight: header hash or height of the block
   * @return {Transactions}: an array of transactions
   */
  public async getBlockTransactions(blockHeight: number): Promise<GenericTransactions<Transaction>> {
    try {
      const res = await axios.get(`${this._explorerEndpoint}${this._explorerApi.getBlockDetail}${blockHeight}`);
      const transactions = new GenericTransactions();
      if (!res.data) {
        throw new Error(`Request fail`);
      }
      const result = res.data.result;

      if (!result.txs || !result.txs.length) {
        return transactions;
      }

      const txs = await Promise.all(_.map(result.txs, async tx => await this.getOneTransaction(tx.tx_hash)));
      if (!txs || !txs.length) {
        return transactions;
      }

      _.map(txs, tx => {
        transactions.push(tx);
      });

      return transactions;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Validate a transaction and broadcast it to the blockchain network
   *
   * @param {string} rawTx: the hex-endcoded transaction data
   * @param {number} retryCount?
   * @returns {string}: the transaction hash is hex
   */
  public async sendRawTransaction(rawTx: string, retryCount?: number): Promise<ISubmittedTransaction> {
    if (!retryCount || isNaN(retryCount)) {
      retryCount = 0;
    }
    const body = {
      Action: 'sendrawtransaction',
      Version: 'v1.0.0',
      Data: rawTx
    };
    try {
      const res = await axios.post(`${this._restEndpoint}${this._restApi.sendRawTx}`, body);
      const receipt = res.data;
      if (receipt.Error !== 0) {
        console.log(receipt);
        throw new Error(`OntBasedGateway::sendRawTransaction(): Send transaction failed`);
      }
      return {txid: receipt.Result};
    } catch (err) {
      if (retryCount + 1 > 5) {
        logger.fatal(`Too many fails sending tx`);
        throw err;
      }
      return this.sendRawTransaction(rawTx, retryCount + 1);
    }
  }

  /**
   * Get balance of an address
   *
   * @param {string} address: address that want to query balance
   * @param {string} currency: address that want to query balance
   * @returns {string}: the current balance of address
   */
  public async getAddressBalance(address: string, currency:any = null): Promise<BigNumber> {
    try {
      const res = await axios.get(`${this._restEndpoint}${this._restApi.getBalance}${this.toBase58(address)}`);
      if (res.data.Error === 0) {
        const balances = res.data.Result;
        let currencyBalance;
        if (currency){
          currencyBalance = balances[currency];
        }else{
          currencyBalance = balances[this._currency.networkSymbol];
        }
        if (currencyBalance) {
          return new BigNumber(currencyBalance);
        }
      }
      return new BigNumber(0);
    } catch (err) {
      throw err;
    }
  }

  public async estimateGasPrice(): Promise<number> {
    try {
      const res = await axios.get(`${this._restEndpoint}${this._restApi.getGasPrice}`);
      if (res.data.Error === 0) {
        const rs = res.data.Result;
        const gas = rs.gasprice;
        if (gas) {
          return new BigNumber(gas).toNumber();
        }
      }
      return GasPrice;
    } catch (err) {
      return GasPrice;
      // throw err;
    }
  }

  public async estimateFee(): Promise<BigNumber> {
    const price = await this.estimateGasPrice();
    if (price) {
      const gas = price * this.getGasLimit();
      if (gas) {
        return new BigNumber(gas);
      }
    }
    return new BigNumber(this.getGasPrice() * this.getGasLimit());
  }

  public getGasPrice(): number {
    return GasPrice;
  }

  public getGasLimit(): number {
    return GasLimit;
  }

  /**
   * Check whether a transaction is finalized on blockchain network
   *
   * @param {string} txid: the hash/id of transaction need to be checked
   * @return {string}: the tx status
   */
  // TODO: can receive tx status by decoded raw tx?
  public async getTransactionStatus(txid: string): Promise<TransactionStatus> {
    let txStatus: TransactionStatus;

    try {
      const response = await this.getOneTransaction(txid);
      if (!response) {
        txStatus = TransactionStatus.FAILED;
      } else {
        if (new BigNumber(response.block.number).gte(this.getCurrencyConfig().requiredConfirmations)) {
          txStatus = TransactionStatus.COMPLETED;
        } else {
          txStatus = TransactionStatus.CONFIRMING;
        }
      }
    } catch (err) {
      txStatus = TransactionStatus.UNKNOWN;
    }
    return txStatus;
  }

  /**
   * minimum fee for seeding in almost case
   */
  public async getAverageSeedingFee(): Promise<BigNumber> {
    return this.estimateFee();
  }

  /**
   * _convertRawToTransactions used to convert raw transactions to transactions
   *
   * @param {IRawTransaction} rawTx: the raw transaction after decoded tx
   * @param {BlockHeader} blockHeader: header of block
   * @param {number} latestBlock: latest block number
   * @param {fee} fee
   * @returns {Transactions} transactions: the bnb transactions detail
   */
  public abstract _convertRawToTransactions(
    rawTx: IOntRawTransaction,
    blockHeader: BlockHeader,
    latestBlock: number,
    fee: BigNumber
  ): OntTransaction;

  /**
   * constructRawTransaction construct raw transaction data without signature
   */
  public abstract async constructRawTransaction(
    from: string,
    to: string,
    amount: BigNumber,
    options?: any
  ): Promise<IRawTransaction>;

  public abstract async convertBlock(block: any): Promise<Block>;

  public abstract getRawTx(tx: any): IOntRawTransaction;

  /**
   * getFeeTx used to get the network transaction fee
   * @returns {BigNumber} fee: network fee
   */
  // TODO: is it possible if we get tx fee directly from fullnode?
  // we can use https://data-seed-pre-0-s3.binance.org/abci_query?path="/param/fees"
  // but it's amino-encoded, so, need to decode.
  public abstract getFeeTx(rawTx: any): BigNumber;

  /**
   * Get one transaction object
   *
   * @param {string} txid: the transaction hash
   * @returns {OntTransaction}: the transaction details
   */
  protected async _getOneTransaction(txid: string): Promise<OntTransaction> {
    try {
      const res = await axios.get(`${this._explorerEndpoint}${this._explorerApi.getTxDetail}/${txid}`);
      const result = res.data.result;
      const blockInfo = await this.getOneBlock(new BigNumber(result.block_height).toNumber());
      const latestBlock = await this.getBlockCount();
      const blockHeader = new BlockHeader({
        hash: blockInfo.hash,
        number: blockInfo.number,
        timestamp: blockInfo.timestamp,
      });
      const rawTx: IOntRawTransaction = this.getRawTx(result);
      const txFee = await this.getFeeTx(rawTx);
      return this._convertRawToTransactions(rawTx, blockHeader, latestBlock, txFee);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get block details in application-specified format
   *
   * @param {string|number} blockHash: the block hash (or block number in case the parameter is Number)
   * @returns {Block} block: the block detail
   */
  protected async _getOneBlock(blockHash: string | number): Promise<Block> {
    try {
      const response = await axios.get(`${this._explorerEndpoint}${this._explorerApi.getBlockDetail}/${blockHash}`);
      return this.convertBlock(response.data.result);
    } catch (err) {
      throw err;
    }
  }

  protected abstract toBase58(address: string): string;
}

export default OntBasedGateway;
