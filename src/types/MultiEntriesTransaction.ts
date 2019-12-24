import { BlockHeader, Transaction, TransferEntry } from './';
import { BigNumber, ICurrency } from '../..';

export interface IMultiEntriesTransactionProps {
  readonly txid: string;
  readonly fee: BigNumber;
}

export interface IEntry {
  readonly address: string;
  readonly currency: ICurrency;
  readonly amount: string;
}

export class MultiEntriesTransaction extends Transaction {
  public readonly block: BlockHeader;
  public readonly outputs: IEntry[];
  public readonly inputs: IEntry[];
  public readonly fee: BigNumber;
  constructor(
    tx: IMultiEntriesTransactionProps,
    outEntry: IEntry[],
    inEntry: IEntry[],
    block: BlockHeader,
    lastNetworkBlockNumber: number
  ) {
    const txProps = {
      confirmations: lastNetworkBlockNumber - block.number + 1,
      height: block.number,
      timestamp: block.timestamp,
      txid: tx.txid,
    };
    super(txProps, block);
    this.block = block;
    this.inputs = inEntry;
    this.outputs = outEntry;
    this.fee = tx.fee;
  }
  public _extractEntries(): TransferEntry[] {
    const entries: TransferEntry[] = [];

    // All in v Ins
    this.inputs.forEach(vIn => {
      const entry = this._convertVInToTransferEntry(vIn);
      if (entry) {
        entries.push(entry);
      }
    });

    // All in v Outs
    this.outputs.forEach(vOut => {
      const entry = this._convertVoutToTransferEntry(vOut);
      if (entry) {
        entries.push(entry);
      }
    });

    return TransferEntry.mergeEntries(entries);
  }
  public getExtraDepositData(): any {
    return Object.assign({}, super.getExtraDepositData(), {});
  }

  public getNetworkFee(): BigNumber {
    return this.fee;
  }

  protected _convertVInToTransferEntry(vIn: IEntry): TransferEntry {
    return {
      amount: new BigNumber(-vIn.amount),
      currency: vIn.currency,
      address: vIn.address,
      txid: this.txid,
      tx: this,
    };
  }

  protected _convertVoutToTransferEntry(vOut: IEntry): TransferEntry {
    return {
      amount: new BigNumber(vOut.amount),
      currency: vOut.currency,
      address: vOut.address,
      txid: this.txid,
      tx: this,
    };
  }
}

export default MultiEntriesTransaction;
