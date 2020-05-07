import BigNumber from 'bignumber.js';

/**
 * Raw transaction which is constructed offline
 */
export interface IRawTransaction {
  txid: string;
  unsignedRaw: string;
}


export interface IRawMultisigTransaction {
  txid: string;
  unsignedRaw: string;
  cosignatory: string;
}

/**
 * Basically IRawTransaction with signature(s)
 * Ready to send/broadcast to network
 */
export interface ISignedRawTransaction extends IRawTransaction {
  signedRaw: string;
}

export interface ISignedRawMultisigTransaction extends ISignedRawTransaction {
  cosignatory: string;
}

/**
 * Result after submit/send ISignedRawTransaction to the network
 */
export interface ISubmittedTransaction {
  readonly txid: string;
  readonly blockNumber?: number;
}
