import LRU from 'lru-cache';
import BigNumber from 'bignumber.js';
import RPCClient from './RPCClient';
import { ICurrency } from './interfaces';
import { Account, Block, Transaction, Transactions, IEndpointsStatus } from './types';
import { TransactionStatus } from './enums';
import { ICurrencyConfig, ISignedRawTransaction, ISubmittedTransaction } from './interfaces';
import AccountHdWallet from './types/AccountHdWallet';
export interface IParamsHDWallet {
    seed: string;
    accountIndex: string;
    path: string;
}
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
    createAccountHdWalletAsync(params: IParamsHDWallet): Promise<AccountHdWallet>;
    generatePrivateKeyHdWalletAsync(params: IParamsHDWallet): Promise<string>;
    generateSeed(): string;
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
    estimateFee(options: {
        isConsolidate: boolean;
        useLowerNetworkFee?: boolean;
        totalInputs?: number;
        recentWithdrawalFee?: number;
    }): Promise<BigNumber>;
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
