import { BlockHeader, IEntry } from '../..';
import { IMultiEntriesTransactionProps, MultiEntriesTransaction } from './MultiEntriesTransaction';
import BigNumber from 'bignumber.js';

export const TypeTx = {
  StdTx: 'core/StdTx',
};

export const TypeMsg = {
  MsgSend: 'bank/MsgSend',
};

export interface ICosmosRawTransaction {
  readonly height: number;
  readonly txHash: string;
  readonly memo: string;
  readonly logs: string;
  readonly txType: string;
  readonly fee: BigNumber;
  readonly outEntries: IEntry[];
  readonly inEntries: IEntry[];
}

export interface ICosmosTransactionProps extends IMultiEntriesTransactionProps {
  readonly memo: string;
}

export class CosmosTransaction extends MultiEntriesTransaction {
  public readonly memo: string;
  constructor(
    tx: ICosmosTransactionProps,
    outEntry: IEntry[],
    inEntry: IEntry[],
    block: BlockHeader,
    lastNetworkBlockNumber: number
  ) {
    super(tx, outEntry, inEntry, block, lastNetworkBlockNumber);
    this.memo = tx.memo;
  }

  public extractAdditionalField(): any {
    return {
      memo: this.memo,
    };
  }
}

export default CosmosTransaction;
