import _ from 'lodash';
import LRU from 'lru-cache';
import util from 'util';
import {
  Account,
  Block,
  Transaction,
  Transactions,
  TransactionStatus,
  RPCClient,
  ICurrency,
  implement,
  Utils,
  BigNumber,
  CCEnv,
  getLogger,
} from '..';
import { ICurrencyConfig } from './interfaces';

const logger = getLogger('BaseGateway');
/**
 * The gateway provides methods/interfaces for our service
 * to connect to blockchain network
 * The method will be implemented in derived classes
 * They can be done via RPC calls, RESTful APIs, ...
 */
export abstract class BaseGateway {
  public static getInstance(): BaseGateway {
    throw new Error(`Must be implemented in derived class.`);
  }

  protected _cacheBlock: LRU<string | number, Block>;
  protected _cacheTxByHash: LRU<string, Transaction>;
  protected readonly _rpcClient: RPCClient;
  protected readonly _currency: ICurrency;

  // Gateways are singletons
  // So we hide the constructor from outsiders
  protected constructor(currency: ICurrency) {
    // Initiate the caches
    this._cacheBlock = new LRU(this._getCacheOptions());
    this._cacheTxByHash = new LRU(this._getCacheOptions());
    this._currency = currency;

    const rpcRawConfig = CCEnv.getCurrencyConfig(currency).rpcConfig;
    if (rpcRawConfig) {
      try {
        const rpcConfig = JSON.parse(rpcRawConfig);
        this._rpcClient = new RPCClient(rpcConfig);
      } catch (e) {
        logger.error(`BaseGateway::constructor could not contruct RPC Client due to error: ${util.inspect(e)}`);
      }
    }
  }

  public getCurrency(): ICurrency {
    return this._currency;
  }

  public getCurrencyConfig(): ICurrencyConfig {
    return CCEnv.getCurrencyConfig(this._currency);
  }

  /**
   * Create a new random account/address
   * With some currencies we cannot create account with a synchronous method
   * Then now we always handle creating account by async function
   * @returns {Account} the account object
   */
  public abstract async createAccountAsync(): Promise<Account>;

  /**
   * Check a given address is valid
   * Default just accept all value, need to be implemented on all derived classes
   *
   * @param address
   */
  public async isValidAddressAsync(address: string): Promise<boolean> {
    return true;
  }

  /**
   * Handle more at extended classes
   * @param address
   */
  @implement
  public normalizeAddress(address: string): string {
    return address;
  }

  /**
   * Get one transaction object by tixd
   * Firstly looking for it from cache
   * If cache doesn't exist, then get it from blockchain network
   *
   * @param {String} txid: the transaction hash
   * @returns {Transaction}: the transaction details
   */
  @implement
  public async getOneTransaction(txid: string): Promise<Transaction> {
    let tx = this._cacheTxByHash.get(txid);
    if (!tx) {
      tx = await this._getOneTransaction(txid);
    }

    if (!tx) {
      return null;
    }

    const lastNetworkBlock = await this.getBlockCount();
    tx.confirmations = lastNetworkBlock - tx.block.number + 1;
    this._cacheTxByHash.set(txid, tx);
    return tx;
  }

  public getLimitRun(): any {
    // TODO: FIXME
    return null;
  }

  /**
   * Returns transactions with given txids
   *
   * @param {Array} txids: the array of transaction hashes/ids
   * @returns {Array}: the array of detailed transactions
   */
  @implement
  public async getTransactionsByIds(txids: string[]): Promise<Transactions> {
    const result = new Transactions();
    if (!txids || !txids.length) {
      return result;
    }

    const getOneTx = async (txid: string) => {
      const tx = await this.getOneTransaction(txid);
      if (tx) {
        result.push(tx);
      }
    };

    const tasks = txids.map(async txid => {
      if (this.getLimitRun()) {
        return this.getLimitRun()(async () => {
          return await getOneTx(txid);
        });
      } else {
        return await getOneTx(txid);
      }
    });

    await Utils.PromiseAll(tasks);
    return result;
  }

  /**
   * Get block by the number or hash
   * Firstly looking for it from cache
   * If cache doesn't exist, then get it from blockchain network
   *
   * @param {string|number} blockHash: the block hash (or block number in case the parameter is Number)
   * @returns {Block} block: the block detail
   */
  @implement
  public async getOneBlock(blockHash: string | number): Promise<Block> {
    const cachedBlock = this._cacheBlock.get(blockHash);
    if (cachedBlock) {
      return cachedBlock;
    }

    const block = await this._getOneBlock(blockHash);
    this._cacheBlock.set(blockHash, block);
    return block;
  }

  /**
   * ReturnblockblockHash: string | numberdition.
   *
   * @param {Number} fromBlockNumber: number of begin block in search range
   * @param {Number} toBlockNumber: number of end block in search range
   * @returns {Transactions}: an array of transactions
   */
  @implement
  public async getMultiBlocksTransactions(fromBlockNumber: number, toBlockNumber: number): Promise<Transactions> {
    if (fromBlockNumber > toBlockNumber) {
      throw new Error(`fromBlockNumber must be less than toBlockNumber`);
    }

    const count = toBlockNumber - fromBlockNumber + 1;
    const blockNumbers = Array.from(new Array(count), (val, index) => index + fromBlockNumber);
    const result = new Transactions();
    await Promise.all(
      blockNumbers.map(async blockNumber => {
        const txs = await this.getBlockTransactions(blockNumber);
        const transactions = _.compact(txs);
        result.push(...transactions);
      })
    );
    return result;
  }

  /**
   * Returns all transactions in givent block.
   *
   * @param {string|number} blockHash: header hash or height of the block
   * @returns {Transactions}: an array of transactions
   */

  /**
   * getBlockTransactions from network
   * @param blockHash
   */
  @implement
  public async getBlockTransactions(blockNumber: string | number): Promise<Transactions> {
    const block = await this.getOneBlock(blockNumber);
    const txs = await this.getTransactionsByIds(_.compact(block.txids));
    return txs;
  }

  /**
   * No param
   * Returns the number of blocks in the local best block chain.
   * @returns {number}: the height of latest block on the block chain
   */
  public abstract async getBlockCount(): Promise<number>;

  /**
   * Get balance of an address
   *
   * @param {String} address: address that want to query balance
   * @returns {string}: the current balance of address
   */
  public abstract async getAddressBalance(address: string): Promise<BigNumber>;

  /**
   * Check whether a transaction is finalized on blockchain network
   *
   * @param {string} txid: the hash/id of transaction need to be checked
   * @returns {string}: the tx status
   */
  public abstract async getTransactionStatus(txid: string): Promise<TransactionStatus>;

  /**
   * Get block detailstxidstxids: string[]*
   * @param {string|number} blockHash: the block hash (or block number in case the parameter is Number)
   * @returns {Block} block: the block detail
   */
  protected abstract async _getOneBlock(blockHash: string | number): Promise<Block>;

  /**
   * Get one transaction object from blockchain network
   *
   * @param {String} txid: the transaction hash
   * @returns {Transaction}: the transaction details
   */
  protected abstract async _getOneTransaction(txid: string): Promise<Transaction>;

  /**
   * Get cache options. Override this in derived class if needed
   *
   * @returns {LRU.Options} options for cache storage
   */
  @implement
  protected _getCacheOptions() {
    return {
      max: 1024 * 1024,
      maxAge: 1000 * 60 * 60, // 1 hour
    };
  }
}

export default BaseGateway;
