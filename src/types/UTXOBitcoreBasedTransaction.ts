import { BlockHeader } from './BlockHeader';
import { Transaction } from './Transaction';
import { TransferEntry } from './TransferEntry';
import { implement } from '../Utils';
import { IBitcoreBoiledVIn, IBitcoreBoiledVOut, IBitcoreUtxoTxInfo, ICurrency } from '../interfaces';
import BigNumber from 'bignumber.js';

const bchaddr = require('bchaddrjs');

export class UTXOBitcoreBasedTransaction extends Transaction {
  public readonly vIns: IBitcoreBoiledVIn[];
  public readonly vOuts: IBitcoreBoiledVOut[];
  public readonly currency: ICurrency;

  constructor(currency: ICurrency, tx: IBitcoreUtxoTxInfo, block: BlockHeader) {
    // Construct tx props
    const txProps = {
      confirmations: tx.confirmations,
      height: block.number,
      timestamp: new Date(block.timestamp).getTime(),
      txid: tx.txid,
    };

    // Construct base transaction
    super(txProps, block);
    // And vin/vout for utxo-based
    this.currency = currency;
    this.vIns = tx.inputs;
    this.vOuts = tx.outputs;
  }

  public getSatoshiFactor(): number {
    // return 1e8;
    return 1;
  }

  @implement
  public _extractEntries(): TransferEntry[] {
    const entries: TransferEntry[] = [];

    // All in v Ins
    this.vIns.forEach(vIn => {
      const entry = this._convertVInToTransferEntry(vIn);
      if (entry) {
        entries.push(entry);
      }
    });

    // All in v Outs
    this.vOuts.forEach(vOut => {
      const entry = this._convertVOutToTransferEntry(vOut);
      if (entry) {
        entries.push(entry);
      }
    });

    return TransferEntry.mergeEntries(entries);
  }

  /**
   * Network fee is simple total input subtract total output
   */
  public getNetworkFee(): BigNumber {
    let result = new BigNumber(0);
    this.extractEntries().forEach(entry => {
      result = result.plus(entry.amount);
    });

    // We want to retreive the positive value
    return result.times(-1);
  }

  /**
   * Transform vIn to transfer entry
   *
   * @param vIn
   */
  protected _convertVInToTransferEntry(vIn: IBitcoreBoiledVIn): TransferEntry {
    if (!vIn.address) {
      return null;
    }

    return {
      amount: new BigNumber(-vIn.value * this.getSatoshiFactor()),
      currency: this.currency,
      address: bchaddr.isLegacyAddress(vIn.address) ? vIn.address : bchaddr.toLegacyAddress(vIn.address),
      txid: this.txid,
      tx: this,
    };
  }

  /**
   * Transform vOut to transfer entry
   */
  protected _convertVOutToTransferEntry(vOut: IBitcoreBoiledVOut): TransferEntry {
    // If output is not a coin-transfer, just ignore it
    // We don't care about things other than coin transferring in this project
    if (!vOut.address || vOut.address === 'false') {
      return null;
    }

    // TODO: check MULTISIG

    // Otherwise it's just a transfer to normal address
    // Handle for vout with single sig :) or unparsed address
    // case: vOut.scriptPubKey.addresses has 1 or 0 element
    // normal vout
    return {
      amount: new BigNumber(vOut.value * this.getSatoshiFactor()),
      currency: this.currency,
      address: bchaddr.isLegacyAddress(vOut.address) ? vOut.address : bchaddr.toLegacyAddress(vOut.address),
      txid: this.txid,
      tx: this,
    };
  }
}
