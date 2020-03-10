import { BaseGateway } from '..';
import { IRawVOut, IRawTransaction, IInsightUtxoInfo } from './interfaces';
export declare abstract class UTXOBasedGateway extends BaseGateway {
    abstract constructRawTransaction(fromAddresses: string | string[], vouts: IRawVOut[]): Promise<IRawTransaction>;
    abstract constructRawConsolidateTransaction(utxos: IInsightUtxoInfo[], toAddress: string): Promise<IRawTransaction>;
    abstract reconstructRawTx(rawTx: string): IRawTransaction;
    protected validateRawTx(rawTx: IRawTransaction): boolean;
}
