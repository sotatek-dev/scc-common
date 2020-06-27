import BigNumber from 'bignumber.js';
import { Account } from './types/Account';
import { Block } from './types/Block';
import { UTXOBasedGateway } from './UTXOBasedGateway';
import { TransactionStatus } from './enums/TransactionStatus';
import { BitcoinBasedTransaction } from './types/BitcoinBasedTransaction';
import { BitcoinBasedTransactions } from './types/BitcoinBasedTransactions';
import { ISignedRawTransaction, ISubmittedTransaction, IRawVOut, IRawTransaction, IInsightUtxoInfo, IBoiledVOut, IBitcoreUtxoInput } from './interfaces';
export declare abstract class BitcoinBasedGateway extends UTXOBasedGateway {
    static convertInsightUtxoToBitcoreUtxo(utxos: IInsightUtxoInfo[]): IBitcoreUtxoInput[];
    isValidAddressAsync(address: string): Promise<boolean>;
    createAccountAsync(): Promise<Account>;
    getAccountFromPrivateKey(rawPrivateKey: string): Promise<Account>;
    constructRawTransaction(fromAddresses: string | string[], vouts: IRawVOut[]): Promise<IRawTransaction>;
    constructRawConsolidateTransaction(pickedUtxos: IInsightUtxoInfo[], toAddress: string): Promise<IRawTransaction>;
    signRawTransaction(unsignedRaw: string, privateKeys: string | string[]): Promise<ISignedRawTransaction>;
    sendRawTransaction(signedRawTx: string): Promise<ISubmittedTransaction>;
    reconstructRawTx(rawTx: string): IRawTransaction;
    getBlockCount(): Promise<number>;
    getAddressBalance(address: string): Promise<BigNumber>;
    getTransactionStatus(txid: string): Promise<TransactionStatus>;
    getOneAddressUtxos(address: string): Promise<IInsightUtxoInfo[]>;
    getMultiAddressesUtxos(addresses: string[]): Promise<IInsightUtxoInfo[]>;
    getOneTxVouts(txid: string, address?: string): Promise<IBoiledVOut[]>;
    getMultiTxsVouts(txids: string[], address?: string): Promise<IBoiledVOut[]>;
    getBlockTransactions(blockNumber: string | number): Promise<BitcoinBasedTransactions>;
    estimateFee(options: {
        totalInputs?: number;
    }): Promise<BigNumber>;
    getInsightAPIEndpoint(): string;
    getFeeInSatoshisPerByte(): Promise<number>;
    getParallelNetworkRequestLimit(): number;
    protected _fetchOneBlockTxsInsightPage(block: Block, page: number, pageTotal: number, networkBlockCount: number): Promise<BitcoinBasedTransaction[]>;
    protected _constructRawTransaction(pickedUtxos: IInsightUtxoInfo[], vouts: IRawVOut[], esitmatedFee: BigNumber): IRawTransaction;
    protected _getOneBlock(blockIdentifier: string | number): Promise<Block>;
    protected _getOneTransaction(txid: string): Promise<BitcoinBasedTransaction>;
    protected abstract getBitCoreLib(): any;
}
