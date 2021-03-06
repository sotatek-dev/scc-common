import * as _ from 'lodash';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { IToken, ISubmittedTransaction } from './interfaces';
import { TransactionStatus } from './enums';
import {
  Transaction,
  Block,
  BlockHeader,
  CosmosTransaction,
  GenericTransactions,
  ICosmosRawTransaction,
} from './types';
import * as Utils from './Utils';
import { getLogger } from './Logger';
import BaseGateway from './BaseGateway';
import { ICurrency, IRawTransaction } from './interfaces';
import { Address } from './types';

const logger = getLogger('CosmosBasedGateway');
const _cacheBlockNumber = {
  value: 0,
  updatedAt: 0,
  isRequesting: false,
};

const UrlRestApi = {
  getBlockCount: `/blocks/latest`,
  getBlockNumber: `/blocks`,
  getOneTransaction: '/txs',
  getAllBlockTransactions: '/txs?limit=1000&tx.height=',
  postOneTransaction: '/txs',
  getFeeAndGas: '/txs/estimate_fee',
  getBalance: '/bank/balances',
  getAccount: '/auth/accounts',
};

export interface ICurrencyParamsConstructTx {
  currency: ICurrency;
  amount: BigNumber;
}

export interface IMultiCurrenciesParamsConstructTx {
  fromAddress: Address;
  toAddress: Address;
  entries: ICurrencyParamsConstructTx[];
}

export interface IMultiEntriesParamsConstructTx {
  fromAddress: Address;
  toAddress: Address;
  entry: ICurrencyParamsConstructTx;
}

export abstract class CosmosBasedGateway extends BaseGateway {
  protected _currency: IToken;
  // _appClient used to connect to cosmos public node
  // to deploy transaction to network
  protected _appClient: any;
  protected _url: any;
  public constructor(currency: IToken, url?: any) {
    super(currency);
    const config = this.getCurrencyConfig();
    // specific cosmos public API endpoint
    this._appClient = config.restEndpoint;
    if (url) {
      this._url = url;
    } else {
      this._url = UrlRestApi;
    }
  }

  public async getAccount(address: string): Promise<any> {
    const res = await axios.get(`${this._appClient}${this._url.getAccount}/${address}`);
    return res.data;
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
      const response = await axios.get(`${this._appClient}${this._url.getBlockCount}`);
      blockHeight = response.data.block_meta.header.height;
    } catch (err) {
      logger.error(err);
      blockHeight = _cacheBlockNumber.value;
    }

    const newUpdateAt = Utils.nowInMillis();
    _cacheBlockNumber.value = blockHeight;
    _cacheBlockNumber.updatedAt = newUpdateAt;
    _cacheBlockNumber.isRequesting = false;
    logger.debug(`CosmosBasedGateway::getBlockCount value=${blockHeight} updateAt=${newUpdateAt}`);
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
      const res = await axios.get(`${this._appClient}${this._url.getAllBlockTransactions}${blockHeight}`);
      const transactions = new GenericTransactions();
      const data = res.data;
      if (!data) {
        throw new Error(`Request fail`);
      }
      const txs = data.txs;
      if (!txs || !txs.length) {
        return transactions;
      }
      const blockInfo = (await this.getOneBlock(blockHeight)) as Block;
      const latestBlock = await this.getBlockCount();
      const blockHeader = new BlockHeader({
        hash: blockInfo.hash,
        number: blockInfo.number,
        timestamp: blockInfo.timestamp,
      });

      _.map(txs, tx => {
        const rawTx: ICosmosRawTransaction = this.getCosmosRawTx(tx);
        const _transaction = this._convertRawToCosmosTransactions(rawTx, blockHeader, latestBlock);
        transactions.push(_transaction);
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
   * @returns {string}: the transaction hash is hex
   */
  public async sendRawTransaction(rawTx: string, retryCount?: number): Promise<ISubmittedTransaction> {
    if (!retryCount || isNaN(retryCount)) {
      retryCount = 0;
    }
    const txBroadcast = rawTx;
    try {
      const res = await axios.post(`${this._appClient}${this._url.postOneTransaction}`, txBroadcast);
      const receipt = res.data;
      if (receipt.height === '0') {
        throw new Error(receipt.raw_log);
      }
      return { txid: receipt.txhash };
    } catch (err) {
      if (retryCount + 1 > 5) {
        logger.error(`Too many fails sending tx`);
        throw err;
      }

      return this.sendRawTransaction(rawTx, retryCount + 1);
    }
  }

  /**
   * Get balance of an address
   *
   * @param {string} address: address that want to query balance
   * @returns {string}: the current balance of address
   */
  public async getAddressBalance(address: string): Promise<BigNumber> {
    try {
      const res = await axios.get(`${this._appClient}${this._url.getBalance}/${address}`);
      const balance = res.data;
      if (!balance) {
        return new BigNumber(0);
      }
      const currencyBalance = balance.result.find((_balance: any) => _balance.denom === this.getCode());
      if (!currencyBalance || !currencyBalance.amount) {
        return new BigNumber(0);
      }
      return new BigNumber(currencyBalance.amount);
    } catch (err) {
      throw err;
    }
  }

  public async etimateFee(rawTx: any) {
    try {
      const res = await axios.post(`${this._appClient}${this._url.getFeeAndGas}`, { estimate_req: rawTx });
      return res.data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Check whether a transaction is finalized on blockchain network
   *
   * @param {string} txid: the hash/id of transaction need to be checked
   * @return {string}: the tx status
   */
  // TODO: can receive tx status by decoded raw tx?
  // is it possible if we check by parameter {'log': 'Msg 0: '} ?
  // check it later
  public async getTransactionStatus(txid: string): Promise<TransactionStatus> {
    let txStatus: TransactionStatus;

    try {
      const response = await this.getOneTransaction(txid);
      if (!response) {
        txStatus = TransactionStatus.FAILED;
      } else {
        const tx = response;
        if (new BigNumber(tx.block.number).gte(this.getCurrencyConfig().requiredConfirmations)) {
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
    throw new Error('TODO: Implement me');
  }
  /**
   * _convertRawToBnbTransactions used to convert raw transactions to transactions
   *
   * @param {ICosmosRawTransaction} rawTx: the raw transaction after decoded tx
   * @param {BlockHeader} blockHeader: header of block
   * @param {number} latestBlock: latest block number
   * @returns {CosmosTransactions} transactions: the bnb transactions detail
   */
  public abstract _convertRawToCosmosTransactions(
    rawTx: ICosmosRawTransaction,
    blockHeader: BlockHeader,
    latestBlock: number,
    fee?: BigNumber
  ): CosmosTransaction;

  public abstract async constructRawTransaction(
    param: IMultiCurrenciesParamsConstructTx,
    options: {
      isConsolidate?: boolean;
      destinationTag?: string;
      feeCoin?: ICurrency;
    }
  ): Promise<IRawTransaction>;

  public abstract getCosmosRawTx(tx: any): ICosmosRawTransaction;

  public abstract getFeeTx(rawTx: any): BigNumber;

  public abstract getCode(): string;
  public abstract async convertCosmosBlock(block: any): Promise<Block>;
  /**
   * getFeeTx used to get the network transaction fee
   * @returns {BigNumber} fee: network fee
   */
  // TODO: is it possible if we get tx fee directly from fullnode?
  // we can use https://data-seed-pre-0-s3.binance.org/abci_query?path="/param/fees"
  // but it's amino-encoded, so, need to decode.

  /**
   * Get one transaction object
   *
   * @param {string} txid: the transaction hash
   * @returns {CosmosTransaction}: the transaction details
   */
  protected async _getOneTransaction(txid: string): Promise<CosmosTransaction> {
    try {
      const res = await axios.get(`${this._appClient}${this._url.getOneTransaction}/${txid}`);
      const result = res.data;
      const blockInfo = await this.getOneBlock(new BigNumber(result.height).toNumber());
      const latestBlock = await this.getBlockCount();
      const blockHeader = new BlockHeader({
        hash: blockInfo.hash,
        number: blockInfo.number,
        timestamp: blockInfo.timestamp,
      });
      const rawTx: ICosmosRawTransaction = this.getCosmosRawTx(result);
      const txFee = await this.getFeeTx(rawTx);
      const transactions = this._convertRawToCosmosTransactions(rawTx, blockHeader, latestBlock, txFee);
      return transactions;
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
      const response = await axios.get(`${this._appClient}${this._url.getBlockNumber}/${blockHash}`);
      const block = this.convertCosmosBlock(response.data);
      return block;
    } catch (err) {
      throw err;
    }
  }
}

export default CosmosBasedGateway;
