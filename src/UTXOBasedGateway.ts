import { BaseGateway } from './BaseGateway';
import { IRawVOut, IRawTransaction, IInsightUtxoInfo, IBoiledVOut } from './interfaces';

export abstract class UTXOBasedGateway extends BaseGateway {
  public async getMultiAddressesUtxos(addresses: string[]): Promise<IInsightUtxoInfo[]> {
    const result: IInsightUtxoInfo[] = [];
    for (const address of addresses) {
      result.push(...(await this.getOneAddressUtxos(address)));
    }
    return result;
  }
  /**
   * Create a raw transaction that tranfers currencies
   * from an address (in most cast it's a hot wallet address)
   * to one or multiple addresses
   * This method is async because we need to check state of sender address
   * Errors can be throw if the sender's balance is not sufficient
   *
   * @returns {IRawTransaction}
   */
  public abstract async constructRawTransaction(
    fromAddresses: string | string[],
    vouts: IRawVOut[]
  ): Promise<IRawTransaction>;

  public abstract async constructRawConsolidateTransaction(
    utxos: IInsightUtxoInfo[],
    toAddress: string
  ): Promise<IRawTransaction>;

  /**
   * Re-construct raw transaction from output of "constructRawTransaction" method
   * @param rawTx
   */
  public abstract reconstructRawTx(rawTx: string): IRawTransaction;

  public abstract async getOneTxVouts(txid: string, address?: string): Promise<IBoiledVOut[]>;

  public abstract async getOneAddressUtxos(address: string): Promise<IInsightUtxoInfo[]>;

  /**
   * Usually use to make sure the raw transaction has been constructed correctly
   * The hex data from original construction and re-construction should be exactly same
   *
   * @param rawTx
   */
  protected validateRawTx(rawTx: IRawTransaction): boolean {
    const tx = this.reconstructRawTx(rawTx.unsignedRaw);
    return tx.txid === rawTx.txid && tx.unsignedRaw === rawTx.unsignedRaw;
  }
}
