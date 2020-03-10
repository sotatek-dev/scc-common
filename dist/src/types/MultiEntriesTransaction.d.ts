import { Transaction } from './Transaction';
import { ICurrency } from '../interfaces';
import { BlockHeader } from './BlockHeader';
import TransferEntry from './TransferEntry';
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
    protected _convertVInToTransferEntry(vIn: IMultiEntriesTxEntry): TransferEntry;
    protected _convertVoutToTransferEntry(vOut: IMultiEntriesTxEntry): TransferEntry;
}
