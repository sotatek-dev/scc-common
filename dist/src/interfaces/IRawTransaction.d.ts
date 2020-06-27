export interface IRawTransaction {
    txid: string;
    unsignedRaw: string;
}
export interface ISignedRawTransaction extends IRawTransaction {
    signedRaw: string;
}
export interface ISubmittedTransaction {
    readonly txid: string;
    readonly blockNumber?: number;
}
