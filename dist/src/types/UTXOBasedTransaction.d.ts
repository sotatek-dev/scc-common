import { BlockHeader } from './BlockHeader';
import { Transaction } from './Transaction';
import { TransferEntry } from './TransferEntry';
import { IBoiledVIn, IBoiledVOut, IUtxoTxInfo, ICurrency } from '../interfaces';
import BigNumber from 'bignumber.js';
export declare class UTXOBasedTransaction extends Transaction {
    readonly vIns: IBoiledVIn[];
    readonly vOuts: IBoiledVOut[];
    readonly currency: ICurrency;
    constructor(currency: ICurrency, tx: IUtxoTxInfo, block: BlockHeader);
    getSatoshiFactor(): number;
    _extractEntries(): TransferEntry[];
    getNetworkFee(): BigNumber;
    protected _convertVInToTransferEntry(vIn: IBoiledVIn): TransferEntry;
    protected _convertVOutToTransferEntry(vOut: IBoiledVOut): TransferEntry;
}
