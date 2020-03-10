import LRU from 'lru-cache';
import { Account, Block, Transaction, Transactions, TransactionStatus, RPCClient, ICurrency, BigNumber, IEndpointsStatus } from '..';
import { ICurrencyConfig, ISignedRawTransaction, ISubmittedTransaction } from './interfaces';
export declare abstract class BaseGateway {
    protected _cacheBlock: LRU<string | number, Block>;
    protected _cacheTxByHash: LRU<string, Transaction>;
    protected _rpcClient: RPCClient;
    protected readonly _currency: ICurrency;
    protected constructor(currency: ICurrency);
    getCurrency(): ICurrency;
    getCurrencyConfig(): ICurrencyConfig;
    loadCurrencyConfig(): void;
    abstract createAccountAsync(): Promise<Account>;
    abstract getAccountFromPrivateKey(privateKey: string): Promise<Account>;
    isValidAddressAsync(address: string): Promise<boolean>;
    isNeedTagAsync(address: string): Promise<boolean>;
    getNetworkStatus(): Promise<IEndpointsStatus>;
    normalizeAddress(address: string): string;
    getOneTransaction(txid: string): Promise<Transaction>;
    getParallelNetworkRequestLimit(): number;
    getTransactionsByIds(txids: string[]): Promise<Transactions>;
    getOneBlock(blockHash: string | number): Promise<Block>;
    getMultiBlocksTransactions(fromBlockNumber: number, toBlockNumber: number): Promise<Transactions>;
    getBlockTransactions(blockNumber: string | number): Promise<Transactions>;
    abstract getBlockCount(): Promise<number>;
    abstract getAddressBalance(address: string): Promise<BigNumber>;
    abstract getTransactionStatus(txid: string): Promise<TransactionStatus>;
    abstract signRawTransaction(unsignedRaw: string, secret: string | string[]): Promise<ISignedRawTransaction>;
    abstract sendRawTransaction(signedRawTx: string): Promise<ISubmittedTransaction>;
    abstract getAverageSeedingFee(): Promise<BigNumber>;
    protected abstract _getOneBlock(blockHash: string | number): Promise<Block>;
    protected abstract _getOneTransaction(txid: string): Promise<Transaction>;
    protected _getCacheOptions(): {
        max: number;
        maxAge: number;
    };
}
export default BaseGateway;
