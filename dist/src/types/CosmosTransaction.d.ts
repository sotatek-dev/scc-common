import { BlockHeader } from './BlockHeader';
import { MultiEntriesTransaction, IMultiEntriesTxEntry } from './MultiEntriesTransaction';
import BigNumber from 'bignumber.js';
export declare const TypeTx: {
    StdTx: string;
};
export declare const TypeMsg: {
    MsgSend: string;
};
export interface ICosmosRawTransaction {
    readonly height: number;
    readonly txHash: string;
    readonly memo: string;
    readonly logs: string;
    readonly txType: string;
    readonly fee: BigNumber;
    readonly outEntries: IMultiEntriesTxEntry[];
    readonly inEntries: IMultiEntriesTxEntry[];
    readonly gas: number;
}
export interface ICosmosTransactionProps {
    readonly memo: string;
    readonly gas: number;
    readonly txType: string;
    readonly txid: string;
    readonly fee: BigNumber;
}
export declare class CosmosTransaction extends MultiEntriesTransaction {
    readonly memo: string;
    readonly gas: number;
    readonly txType: string;
    readonly fee: BigNumber;
    constructor(tx: ICosmosTransactionProps, outputs: IMultiEntriesTxEntry[], inputs: IMultiEntriesTxEntry[], block: BlockHeader, lastNetworkBlockNumber: number);
    extractAdditionalField(): any;
    getNetworkFee(): BigNumber;
}
export default CosmosTransaction;
