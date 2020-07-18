import BigNumber from 'bignumber.js';
import { IToken, ISubmittedTransaction } from './interfaces';
import { TransactionStatus } from './enums';
import { Transaction, Block, BlockHeader, CosmosTransaction, GenericTransactions, ICosmosRawTransaction } from './types';
import BaseGateway from './BaseGateway';
import { ICurrency, IRawTransaction } from './interfaces';
import { Address } from './types';
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
export declare abstract class CosmosBasedGateway extends BaseGateway {
    protected _currency: IToken;
    protected _appClient: any;
    protected _url: any;
    constructor(currency: IToken, url?: any);
    getAccount(address: string): Promise<any>;
    getBlockCount(): Promise<number>;
    getBlockTransactions(blockHeight: number): Promise<GenericTransactions<Transaction>>;
    sendRawTransaction(rawTx: string, retryCount?: number): Promise<ISubmittedTransaction>;
    getAddressBalance(address: string): Promise<BigNumber>;
    etimateFee(rawTx: any): Promise<any>;
    getTransactionStatus(txid: string): Promise<TransactionStatus>;
    getAverageSeedingFee(): Promise<BigNumber>;
    abstract _convertRawToCosmosTransactions(rawTx: ICosmosRawTransaction, blockHeader: BlockHeader, latestBlock: number, fee?: BigNumber): CosmosTransaction;
    abstract constructRawTransaction(param: IMultiCurrenciesParamsConstructTx, options: {
        isConsolidate?: boolean;
        destinationTag?: string;
        feeCoin?: ICurrency;
    }): Promise<IRawTransaction>;
    abstract getCosmosRawTx(tx: any): ICosmosRawTransaction;
    abstract getFeeTx(rawTx: any): BigNumber;
    abstract getCode(): string;
    abstract convertCosmosBlock(block: any): Promise<Block>;
    protected _getOneTransaction(txid: string): Promise<CosmosTransaction>;
    protected _getOneBlock(blockHash: string | number): Promise<Block>;
}
export default CosmosBasedGateway;
