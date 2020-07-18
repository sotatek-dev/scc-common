import { Transaction } from './Transaction';
import { ICurrency } from '../interfaces';
import { BlockHeader } from './BlockHeader';
import TransferEntry from './TransferEntry';
import { BigNumber } from 'bignumber.js';
export interface IMultiEntriesTransactionProps {
    readonly txid: string;
    readonly fee: BigNumber;
}
export interface IMultiEntriesTxEntry {
    readonly address: string;
    readonly currency: ICurrency;
    readonly amount: string;
}
export interface IMultiEntriesTxProps {
    readonly txid: string;
    readonly inputs: IMultiEntriesTxEntry[];
    readonly outputs: IMultiEntriesTxEntry[];
    readonly block: BlockHeader;
    readonly lastNetworkBlockNumber: number;
}
export declare abstract class MultiEntriesTransaction extends Transaction {
    readonly outputs: IMultiEntriesTxEntry[];
    readonly inputs: IMultiEntriesTxEntry[];
    constructor(props: IMultiEntriesTxProps);
    _extractEntries(): TransferEntry[];
    getExtraDepositData(): any;
    protected _convertVInToTransferEntry(vIn: IMultiEntriesTxEntry): TransferEntry;
    protected _convertVoutToTransferEntry(vOut: IMultiEntriesTxEntry): TransferEntry;
}
export default MultiEntriesTransaction;
