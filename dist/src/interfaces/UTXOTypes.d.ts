import BigNumber from 'bignumber.js';
export interface IRawVIn {
    readonly fromAddress: string;
    readonly amount: BigNumber;
}
export interface IRawVOut {
    readonly toAddress: string;
    readonly amount: BigNumber;
}
export interface IBoiledVIn {
    readonly addr: string;
    readonly txid: string;
    readonly vout: number;
    readonly scriptSig: {
        readonly asm: string;
        readonly hex: string;
    };
    readonly value: number;
    readonly sequence: number;
}
export interface IBoiledVOut {
    readonly value: number;
    readonly n: number;
    readonly scriptPubKey?: {
        readonly asm: string;
        readonly hex: string;
        readonly reqSigs?: number;
        readonly type: string;
        readonly addresses?: string[];
    };
    readonly spentTxId?: string;
    readonly spentIndex?: number;
    readonly spentHeight?: number;
}
export interface IUtxoTxInfo {
    readonly txid: string;
    confirmations: number;
    readonly vin: IBoiledVIn[];
    readonly vout: IBoiledVOut[];
    readonly size: number;
    readonly version: number;
    readonly time: number;
    readonly locktime: number;
    readonly blockhash: string;
    readonly blocktime: number;
}
export interface IUtxoBlockInfo {
    readonly hash: string;
    readonly confirmations: number;
    readonly size: number;
    readonly height: number;
    readonly version: number;
    readonly versionHex: number;
    readonly merkleroot: string;
    readonly time: number;
    readonly mediantime: number;
    readonly nonce: number;
    readonly bits: string;
    readonly difficulty: number;
    readonly previousblockhash: string;
    readonly nextblockhash?: string;
    readonly tx: string[];
    readonly strippedsize: number;
    readonly chainwork: string;
    readonly weight: number;
}
export interface IInsightAddressInfo {
    readonly addrStr: string;
    readonly balance: number;
    readonly balanceSat: number;
    readonly totalReceived: number;
    readonly totalReceivedSat: number;
    readonly totalSent: number;
    readonly totalSentSat: number;
    readonly unconfirmedBalance: number;
    readonly unconfirmedBalanceSat: number;
    readonly unconfirmedTxApperances: number;
    readonly txApperances: number;
}
export interface IInsightUtxoInfo {
    readonly address: string;
    readonly txid: string;
    readonly vout: number;
    readonly scriptPubKey?: string;
    readonly amount: number;
    readonly satoshis: number;
    readonly height: number;
    readonly confirmations: number;
    value?: number;
}
export interface IInsightTxsInfo {
    pagesTotal: number;
    txs: IUtxoTxInfo[];
}
export interface IBitcoreUtxoInput {
    readonly address: string;
    readonly txId: string;
    readonly outputIndex: number;
    readonly script: string;
    readonly satoshis: number;
}
