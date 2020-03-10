import { Address, Transaction, ICurrency } from '../..';
import BigNumber from 'bignumber.js';
interface ITransferEntryProps {
    readonly currency: ICurrency;
    readonly txid: string;
    readonly address: Address;
    readonly amount: BigNumber;
    tx: Transaction;
}
export declare class TransferEntry implements ITransferEntryProps {
    static mergeEntries(entries: TransferEntry[]): TransferEntry[];
    readonly currency: ICurrency;
    readonly txid: string;
    readonly address: Address;
    readonly amount: BigNumber;
    readonly tx: Transaction;
    constructor(props: ITransferEntryProps);
}
export default TransferEntry;
