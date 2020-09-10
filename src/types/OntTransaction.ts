import { BlockHeader } from './BlockHeader';
import {
  MultiEntriesTransaction,
  IMultiEntriesTxProps,
  IMultiEntriesTxEntry
} from './MultiEntriesTransaction';
import BigNumber from 'bignumber.js';

export interface IOntRawTransaction {
  readonly height: number;
  readonly txHash: string;
  readonly txType: string;
  readonly fee: BigNumber;
  readonly inputs: IMultiEntriesTxEntry[];
  readonly outputs: IMultiEntriesTxEntry[];
  readonly gasPrice?: number;
  readonly gasLimit?: number;
}

export class OntTransaction extends MultiEntriesTransaction {
  public readonly fee: BigNumber;
  constructor(
    txHash: string,
    txFee: BigNumber,
    outputs: IMultiEntriesTxEntry[],
    inputs: IMultiEntriesTxEntry[],
    block: BlockHeader,
    lastNetworkBlockNumber: number
  ) {
    const props: IMultiEntriesTxProps = {
      outputs,
      inputs,
      block,
      lastNetworkBlockNumber,
      txid: txHash,
    };

    super(props);
    this.fee = txFee;
  }

  public getNetworkFee(): BigNumber {
    return this.fee;
  }
}

export default OntTransaction;