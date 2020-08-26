import BigNumber from 'bignumber.js';

/**
 * Simple VIn and VOut are formats that are used in constructing transaction
 */
// export interface IRawVIn {
//   readonly fromAddress: string;
//   readonly amount: BigNumber;
// }
//
// export interface IRawVOut {
//   readonly toAddress: string;
//   readonly amount: BigNumber;
// }

/**
 * Boilded VIn and VOut are formats that are returned from APIs of a full node.
 * They're a part of a processed transaction, which has ben recorded on the network already
 * We'll just care and extract the coin transferring portion, other information
 * don't need to be exposed here...
 */
export interface IBitcoreBoiledVIn {
  readonly chain: string;
  readonly network: string;
  readonly coinbase: boolean;
  readonly mintIndex: number;
  readonly spentTxid: string;
  readonly mintTxid: string;
  readonly mintHeight: number;
  readonly spentHeight: number;
  readonly address: string;
  readonly script: string;
  readonly value: number;
  confirmations: number;
  readonly sequenceNumber: number;
}

export interface IBitcoreBoiledVOut {
  readonly chain: string;
  readonly network: string;
  readonly coinbase: boolean;
  readonly mintIndex: number;
  readonly spentTxid: string;
  readonly mintTxid: string;
  readonly mintHeight: number;
  readonly spentHeight: number;
  readonly address: string;
  readonly script: string;
  readonly value: number;
  confirmations: number;
  readonly sequenceNumber: number;
}

/**
 * This is usually the response when calling JSON-RPC API `getrawtransaction`
 * Also the response format that is return from APIs
 * + Get tx details information: `/tx/:txid`
 * + Get txs in a block: `/txs?block={blockNumber}&pageNum={pageNumber}`
 * Each format has some own additional fields, but we just pick the common ones to this interface
 */
export interface IBitcoreUtxoTxInfo {
  readonly txid: string;
  readonly confirmations: number;
  readonly size: number;
  readonly locktime: number;
  readonly blockHash: string;
  readonly blockTime: string;
  readonly blockTimeNormalized: string;
  readonly value: number;
  readonly blockHeight: number;
  readonly inputCount: number;
  readonly outputCount: number;
  readonly fee: number;
  readonly coinbase: boolean;
  readonly _id: string;
  readonly network: string;

  inputs?: IBitcoreBoiledVIn[];
  outputs?: IBitcoreBoiledVOut[];
}

export interface IBitcoreUtxoTxInfoDetail {
  readonly inputs: IBitcoreBoiledVIn[];
  readonly outputs: IBitcoreBoiledVOut[];
}

/**
 * This is usually the response when calling JSON-RPC API `getblock`
 */
// export interface IUtxoBlockInfo {
//   readonly hash: string;
//   readonly confirmations: number;
//   readonly size: number;
//   readonly height: number;
//   readonly version: number;
//   readonly versionHex: number;
//   readonly merkleroot: string;
//   readonly time: number;
//   readonly mediantime: number;
//   readonly nonce: number;
//   readonly bits: string;
//   readonly difficulty: number;
//   readonly previousblockhash: string;
//   readonly nextblockhash?: string;
//   readonly tx: string[];
//   readonly strippedsize: number;
//   readonly chainwork: string;
//   readonly weight: number;
// }

// Response format that is returned from API `/addr/:addr/?noTxList=1`
// export interface IInsightAddressInfo {
//   readonly addrStr: string;
//   readonly balance: number;
//   readonly balanceSat: number;
//   readonly totalReceived: number;
//   readonly totalReceivedSat: number;
//   readonly totalSent: number;
//   readonly totalSentSat: number;
//   readonly unconfirmedBalance: number;
//   readonly unconfirmedBalanceSat: number;
//   readonly unconfirmedTxApperances: number;
//   readonly txApperances: number;
// }

// Response format that is return from API `/addr/:addr/utxo`
// export interface IInsightUtxoInfo {
//   readonly address: string;
//   readonly txid: string;
//   readonly vout: number;
//   readonly scriptPubKey?: string; // TODO Create a unique style for bitcoin based
//   readonly amount: number;
//   readonly satoshis: number;
//   readonly height: number;
//   readonly confirmations: number;
//   // For Omni protocol
//   value?: number;
// }
export interface IBitcoreInsightUtxoInfo {
  readonly _id: string;
  readonly chain: string;
  readonly network: string;
  readonly coinbase: boolean;
  readonly mintIndex: number;
  readonly spentTxid: string;
  readonly mintTxid: string;
  readonly mintHeight: number;
  readonly spentHeight: number;
  readonly address: string;
  readonly script: string;
  readonly value: number;
  readonly confirmations: number;
}

// Response format that is return from API `/txs?block={blockNumber}&pageNum={pageNumber}`
export interface IBitcoreInsightTxsInfo {
  pagesTotal: number;
  txs: IBitcoreUtxoTxInfo[];
}

// Format of utxo that is used by bitcore-lib as inputs of transaction
export interface IBitcoreBaseUtxoInput {
  readonly address: string;
  readonly txId: string;
  readonly vout: number;
  readonly outputIndex: number;
  readonly scriptPubKey: string;
  readonly satoshis: number;
}

// Response format that is return from API `/api/BTC/mainnet/address/:address/balance`
export interface IBitcoreAddressBalance {
  readonly confirmed: number;
  readonly unconfirmed: number;
  readonly balance: number;
}