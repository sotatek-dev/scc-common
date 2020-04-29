import { BlockHeader, TransactionStatus, BigNumber, ISubmittedTransaction, Block, CosmosTransaction, IToken, GenericTransactions, ICosmosRawTransaction, Transaction } from '..';
import BaseGateway from './BaseGateway';
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
    abstract getCosmosRawTx(tx: any): ICosmosRawTransaction;
    abstract getFeeTx(rawTx: any): BigNumber;
    abstract getCode(): string;
    abstract convertCosmosBlock(block: any): Promise<Block>;
    protected _getOneTransaction(txid: string): Promise<CosmosTransaction>;
    protected _getOneBlock(blockHash: string | number): Promise<Block>;
}
export default CosmosBasedGateway;
