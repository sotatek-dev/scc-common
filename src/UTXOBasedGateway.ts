import { BaseGateway } from '..';
import { IRawVIn, IRawVOut, IRawTransaction } from './interfaces';

export abstract class UTXOBasedGateway extends BaseGateway {
  /**
   * Create a raw transaction that tranfers currencies
   * from an address (in most cast it's a hot wallet address)
   * to one or multiple addresses
   * This method is async because we need to check state of sender address
   * Errors can be throw if the sender's balance is not sufficient
   *
   * @returns {IRawTransaction}
   */
  public abstract async constructRawTransaction(vins: IRawVIn[], vouts: IRawVOut[]): Promise<IRawTransaction>;

  /**
   * Re-construct raw transaction from output of "constructRawTransaction" method
   * @param rawTx
   */
  public abstract reconstructRawTx(rawTx: string): IRawTransaction;
}
