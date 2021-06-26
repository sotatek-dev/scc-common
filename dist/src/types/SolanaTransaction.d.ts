import BigNumber from "bignumber.js";
import { ICurrency } from "../interfaces";
import BlockHeader from "./BlockHeader";
import MultiEntriesTransaction, { IMultiEntriesTxEntry } from "./MultiEntriesTransaction";
export interface ISolanaRawTransaction {
    readonly txHash: string;
    readonly height: number;
    readonly fee: BigNumber;
    readonly status: boolean;
    readonly outEntries: IMultiEntriesTxEntry[];
    readonly inEntries: IMultiEntriesTxEntry[];
}
export declare class SolTransaction extends MultiEntriesTransaction {
    readonly txStatus: boolean;
    readonly block: BlockHeader;
    readonly currency: ICurrency;
    readonly fee: BigNumber;
    constructor(currency: ICurrency, tx: ISolanaRawTransaction, block: BlockHeader, lastNetworkBlockNumber: any);
    getNetworkFee(): BigNumber;
}
export default SolTransaction;
