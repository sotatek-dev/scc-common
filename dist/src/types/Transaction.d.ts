import BigNumber from 'bignumber.js';
import { Address, BlockHeader, TransferEntry } from '../..';
interface ITransactionProps {
    readonly txid: string;
    readonly height: number;
    readonly timestamp: number;
    confirmations: number;
}
export declare abstract class Transaction implements ITransactionProps {
    readonly txid: string;
    readonly height: number;
    readonly timestamp: number;
    readonly block: BlockHeader;
    confirmations: number;
    isFailed: boolean;
    protected _allEntries: TransferEntry[];
    constructor(props: ITransactionProps, block: BlockHeader);
    abstract getNetworkFee(): BigNumber;
    extractEntries(): TransferEntry[];
    extractOutputEntries(): TransferEntry[];
    extractInputEntries(): TransferEntry[];
    extractRecipientAddresses(): Address[];
    extractSenderAddresses(): Address[];
    extractAdditionalField(): any;
    getExtraDepositData(): any;
    abstract _extractEntries(): TransferEntry[];
}
export default Transaction;
