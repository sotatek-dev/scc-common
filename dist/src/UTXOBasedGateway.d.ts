import { BaseGateway } from './BaseGateway';
import { IRawVOut, IRawTransaction, IInsightUtxoInfo, IBoiledVOut } from './interfaces';
export declare abstract class UTXOBasedGateway extends BaseGateway {
    getMultiAddressesUtxos(addresses: string[]): Promise<IInsightUtxoInfo[]>;
    abstract constructRawTransaction(fromAddresses: string | string[], vouts: IRawVOut[]): Promise<IRawTransaction>;
    abstract constructRawConsolidateTransaction(utxos: IInsightUtxoInfo[], toAddress: string): Promise<IRawTransaction>;
    abstract reconstructRawTx(rawTx: string): IRawTransaction;
    abstract getOneTxVouts(txid: string, address?: string): Promise<IBoiledVOut[]>;
    abstract getOneAddressUtxos(address: string): Promise<IInsightUtxoInfo[]>;
    protected validateRawTx(rawTx: IRawTransaction): boolean;
}
