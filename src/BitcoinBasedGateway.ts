import { inspect } from 'util';
import Axios from 'axios';
import {
  Account,
  Block,
  PrivateKey,
  UTXOBasedGateway,
  TransactionStatus,
  UTXOBasedTransactions,
  UTXOBasedTransaction,
  BitcoinBasedTransaction,
  getLogger,
  override,
  implement,
  BigNumber,
  Utils,
} from '..';
import {
  ISignedRawTransaction,
  ISubmittedTransaction,
  IRawVOut,
  IRawTransaction,
  IInsightAddressInfo,
  IInsightUtxoInfo,
  IInsightTxsInfo,
  IUtxoTxInfo,
  IUtxoBlockInfo,
  IBoiledVOut,
  IBitcoreUtxoInput,
} from './interfaces';
import { EnvConfigRegistry } from './registries';
import pLimit from 'p-limit';
const limit = pLimit(1);

const logger = getLogger('BitcoinBasedGateway');

export abstract class BitcoinBasedGateway extends UTXOBasedGateway {
  public static convertInsightUtxoToBitcoreUtxo(utxos: IInsightUtxoInfo[]): IBitcoreUtxoInput[] {
    return utxos.map(utxo => ({
      address: utxo.address,
      txId: utxo.txid,
      outputIndex: utxo.vout,
      script: utxo.scriptPubKey,
      satoshis: utxo.satoshis,
    }));
  }

  /**
   * Validate an address
   * @param address
   */
  @override
  public async isValidAddressAsync(address: string): Promise<boolean> {
    const bitcore = this.getBitCoreLib();
    const network = EnvConfigRegistry.isMainnet() ? bitcore.Networks.mainnet : bitcore.Networks.testnet;

    try {
      return bitcore.Address.isValid(address, network);
    } catch (e) {
      logger.error(`Could not validate address ${address} due to error: ${inspect(e)}`);
    }

    return false;
  }

  @implement
  public async createAccountAsync(): Promise<Account> {
    const bitcore = this.getBitCoreLib();
    const network = EnvConfigRegistry.isMainnet() ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
    const privateKey = new bitcore.PrivateKey(null, network);
    const wif = privateKey.toWIF();
    const address = privateKey.toAddress();

    return {
      address: address.toString(),
      privateKey: wif,
    };
  }

  /**
   * Create a raw transaction that tranfers currencies
   * from an address (in most cast it's a hot wallet address)
   * to one or multiple addresses
   * This method is async because we need to check state of sender address
   * Errors can be throw if the sender's balance is not sufficient
   *
   * @returns {IRawTransaction}
   */
  public async constructRawTransaction(fromAddresses: string | string[], vouts: IRawVOut[]): Promise<IRawTransaction> {
    if (typeof fromAddresses === 'string') {
      fromAddresses = [fromAddresses];
    }

    const pickedUtxos: IInsightUtxoInfo[] = [];
    const allUtxos: IInsightUtxoInfo[] = await this.getMultiAddressesUtxos(fromAddresses);
    const totalOutputAmount: BigNumber = vouts.reduce((memo, vout) => {
      return memo.plus(vout.amount);
    }, new BigNumber(0));

    // Estimate fee to choose transaction inputs
    let totalInputAmount: BigNumber = new BigNumber(0);
    let esitmatedFee: BigNumber = new BigNumber(0);
    let estimatedTxSize = 181 + 10; // one vin plus 10
    let isSufficientBalance = false;
    for (const utxo of allUtxos) {
      pickedUtxos.push(utxo);
      totalInputAmount = totalInputAmount.plus(utxo.satoshis);
      estimatedTxSize += 34; // additional vout
      esitmatedFee = new BigNumber(estimatedTxSize * 15); // satoshis per byte. TODO: remove this hard-code
      if (totalInputAmount.gt(new BigNumber(totalOutputAmount.plus(esitmatedFee)))) {
        isSufficientBalance = true;
        break;
      }
    }

    if (!isSufficientBalance) {
      const errMsg =
        'Could not construct tx because of in sufficient balance:' +
        ` addresses=[${fromAddresses}]` +
        ` total balance=${totalInputAmount.toFixed()}` +
        ` total output=${totalOutputAmount.toFixed()}` +
        ` estimatedFee=${esitmatedFee.toFixed()}`;
      throw new Error(errMsg);
    }

    // Since @types/bitcore-lib definition is not up-to-date with original bitcore-lib
    // We need to cast Transaction into `any` type
    // Will remove type casting when @types/bitcore-lib is completed
    let tx: any;
    try {
      tx = new (this.getBitCoreLib()).Transaction().from(pickedUtxos) as any;
      for (const vout of vouts) {
        tx.to(vout.toAddress, vout.amount.toNumber());
      }
      tx.fee(esitmatedFee);
      if (totalInputAmount.gt(totalOutputAmount.plus(esitmatedFee))) {
        tx.change(fromAddresses[0]); // left money for address or first from address
      }
    } catch (e) {
      logger.error(`BitcoinBasedGateway::constructRawTransaction failed due to error:`);
      logger.error(e);
      throw new Error(`TODO: Handle me please...`);
    }

    let txid: string;
    let unsignedRaw: string;
    try {
      txid = tx.hash;
      unsignedRaw = JSON.stringify(tx.toObject());
    } catch (err) {
      logger.error(`Could not serialize tx due to error: ${err}`);
      return null;
    }

    // Make sure we can re-construct tx from the raw data
    try {
      const revivedTx = this.reconstructRawTx(unsignedRaw);
      if (txid !== revivedTx.txid) {
        throw new Error(`Revived transaction has different txid`);
      }

      if (unsignedRaw !== revivedTx.unsignedRaw) {
        throw new Error(`Revived transaction has different raw data`);
      }
    } catch (err) {
      logger.error(`Could not construct tx due to error: ${err}`);
      return null;
    }

    return {
      txid: tx.hash,
      unsignedRaw,
    };
  }

  public async constructRawConsolidateTransaction(
    utxos: IInsightUtxoInfo[],
    toAddress: string
  ): Promise<IRawTransaction> {
    throw new Error(`TODO: Implement me please...`);
  }

  /**
   * Sign a raw transaction with single private key
   * Most likely is used to sign transaction sent from normal hot wallet
   *
   * @param {string} unsignedRaw is result of "constructRawTransaction" method
   * @param {string} privateKey private key to sign, in string format
   *
   * @returns the signed transaction
   */
  public signRawTransaction(unsignedRaw: string, privateKey: PrivateKey): Promise<ISignedRawTransaction> {
    throw new Error(`TODO: Revive me`);
  }

  /**
   * Validate a transaction and broadcast it to the blockchain network
   *
   * @param {String} signedRawTx: the hex-encoded transaction data
   * @returns {String}: the transaction hash in hex
   */
  public async sendRawTransaction(signedRawTx: string): Promise<ISubmittedTransaction> {
    throw new Error(`TODO: Revive me`);
  }

  /**
   * Re-construct raw transaction from output of "constructRawTransaction" method
   * @param rawTx
   */
  @implement
  public reconstructRawTx(rawTx: string): IRawTransaction {
    const bitcore = this.getBitCoreLib();
    const tx = new bitcore.Transaction(JSON.parse(rawTx));
    const unsignedRaw = JSON.stringify(tx.toObject());
    return {
      txid: tx.hash,
      unsignedRaw,
    };
  }

  /**
   * getBlockCount
   */
  @implement
  public async getBlockCount(): Promise<number> {
    return await this._rpcClient.call<number>('getblockcount');
  }

  /**
   * getAddressBalance
   * @param address
   */
  @implement
  public async getAddressBalance(address: string): Promise<BigNumber> {
    const apiEndpoint = this.getInsightAPIEndpoint();
    let response;
    try {
      response = await Axios.get<IInsightAddressInfo>(`${apiEndpoint}/addr/${address}/?noTxList=1`);
    } catch (e) {
      logger.error(e);
      throw new Error(`TODO: handle me please...`);
    }
    const addressInfo = response.data;
    return new BigNumber(addressInfo.balanceSat);
  }

  /**
   * Check whether a transaction is finalized on blockchain network
   *
   * @param {string} txid: the hash/id of transaction need to be checked
   * @returns {string}: the tx status
   */
  @implement
  public async getTransactionStatus(txid: string): Promise<TransactionStatus> {
    const tx = await this.getOneTransaction(txid);
    if (!tx) {
      return TransactionStatus.UNKNOWN;
    }

    const requiredConfirmations = this.getCurrencyConfig().requiredConfirmations;
    if (tx.confirmations >= requiredConfirmations) {
      return TransactionStatus.COMPLETED;
    }

    return TransactionStatus.CONFIRMING;
  }

  @implement
  public async getOneAddressUtxos(address: string): Promise<IInsightUtxoInfo[]> {
    const apiEndpoint = this.getInsightAPIEndpoint();
    let response;
    try {
      response = await Axios.get<IInsightUtxoInfo[]>(`${apiEndpoint}/addr/${address}/utxo`);
    } catch (e) {
      logger.error(e);
      throw new Error(`TODO: handle me please...`);
    }
    const utxos: IInsightUtxoInfo[] = response.data;
    return utxos.sort((a, b) => b.confirmations - a.confirmations);
  }

  @implement
  public async getMultiAddressesUtxos(addresses: string[]): Promise<IInsightUtxoInfo[]> {
    const result: IInsightUtxoInfo[] = [];
    for (const address of addresses) {
      result.push(...(await this.getOneAddressUtxos(address)));
    }
    return result;
  }

  public async getOneTxVouts(txid: string, address?: string): Promise<IBoiledVOut[]> {
    const apiEndpoint = this.getInsightAPIEndpoint();
    let response;
    try {
      response = await Axios.get<IUtxoTxInfo>(`${apiEndpoint}/tx/${txid}`);
    } catch (e) {
      logger.error(e);
      throw new Error(`TODO: Handle me please...`);
    }

    return response.data.vout.filter(vout => {
      if (!address) {
        return true;
      }

      if (!vout.scriptPubKey || !vout.scriptPubKey.addresses || !vout.scriptPubKey.addresses.length) {
        return false;
      }

      return vout.scriptPubKey.addresses.indexOf(address) > -1;
    });
  }

  public async getMultiTxsVouts(txids: string[], address?: string): Promise<IBoiledVOut[]> {
    const result: IBoiledVOut[] = [];
    for (const txid of txids) {
      result.push(...(await this.getOneTxVouts(txid, address)));
    }
    return result;
  }

  /**
   * getBlockTransactions from network
   * @param blockHash
   */
  @override
  public async getBlockTransactions(blockNumber: string | number): Promise<UTXOBasedTransactions> {
    const block = await this.getOneBlock(blockNumber);
    const endpoint = this.getInsightAPIEndpoint();
    const currency = this.getCurrency();
    const listTxs = new UTXOBasedTransactions();
    let response;
    try {
      response = await Axios.get<IInsightTxsInfo>(`${endpoint}/txs?block=${blockNumber}`);
    } catch (e) {
      logger.error(e);
      throw new Error(`TODO: Handle me please...`);
    }
    const pageTotal = response.data.pagesTotal;

    const pages = Array.from(new Array(pageTotal), (val, index) => index);
    await Promise.all(
      pages.map(async page => {
        return limit(async () => {
          let pageResponse;
          try {
            logger.debug(
              `${this.constructor.name}::getBlockTransactions block=${blockNumber} pageNum=${page}/${pageTotal}`
            );
            pageResponse = await Axios.get<IInsightTxsInfo>(`${endpoint}/txs?block=${blockNumber}&pageNum=${page}`);
          } catch (e) {
            logger.error(e);
            throw new Error(`TODO: handle me please...`);
          }
          const txs: IUtxoTxInfo[] = pageResponse.data.txs;
          txs.forEach(tx => {
            const utxoTx = new UTXOBasedTransaction(currency, tx, block);
            listTxs.push(utxoTx);
          });
        });
      })
    );
    return listTxs;
  }

  public getInsightAPIEndpoint(): string {
    return this.getCurrencyConfig().restEndpoint;
  }

  /**
   * Get block detailstxidstxids: string[]*
   * @param {string|number} blockHash: the block hash (or block number in case the parameter is Number)
   * @returns {Block} block: the block detail
   */
  @implement
  protected async _getOneBlock(blockIdentifier: string | number): Promise<Block> {
    let blockHash: string;
    if (typeof blockIdentifier === 'number') {
      blockHash = await this._rpcClient.call<string>('getblockhash', [blockIdentifier as number]);
    } else {
      blockHash = blockIdentifier;
    }

    const block = await this._rpcClient.call<IUtxoBlockInfo>('getblock', [blockHash]);
    const blockProps = {
      hash: block.hash,
      number: block.height,
      timestamp: block.time,
    };

    return new Block(blockProps, block.tx);
  }

  /**
   * Get one transaction object from blockchain network
   *
   * @param {String} txid: the transaction hash
   * @returns {Transaction}: the transaction details
   */
  @implement
  protected async _getOneTransaction(txid: string): Promise<BitcoinBasedTransaction> {
    const apiEndpoint = this.getInsightAPIEndpoint();
    let response;
    try {
      response = await Axios.get<IUtxoTxInfo>(`${apiEndpoint}/tx/${txid}`);
    } catch (e) {
      // logger.error(e);
      throw e;
      // throw new Error(`TODO: Handle me please...`);
    }

    const txInfo: IUtxoTxInfo = response.data;

    // transaction was sent, but it is being not included in any block
    // We just don't count it
    if (!txInfo.blockhash) {
      return null;
    }

    const block = await this.getOneBlock(txInfo.blockhash);
    return new BitcoinBasedTransaction(this.getCurrency(), txInfo, block);
  }

  protected abstract getBitCoreLib(): any;
}
