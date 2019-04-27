import { BaseGateway, PrivateKey, ISignedRawTransaction, ISubmittedTransaction } from '..';
import { IRawVIn, IRawVOut, IRawTransaction } from './interfaces';

export abstract class UTXOBasedGateway extends BaseGateway {
  /**
   * Create a raw transaction that tranfers currencies
   * from an address (in most cast it's a hot wallet address)
   * to one or multiple addresses
   * This method is async because we need to check state of sender address
   * Errors can be throw if the sender's balance is not sufficient
   *
   * @param {string} fromAddress
   * @param {IVout[]} vouts
   *
   * @returns {IRawTransaction}
   */
  public abstract async constructRawTransaction(vins: IRawVIn[], vouts: IRawVOut[]): Promise<IRawTransaction>;

  /**
   * Sign a raw transaction with single private key
   * Most likely is used to sign transaction sent from normal hot wallet
   *
   * @param {string} unsignedRaw is result of "createRawTransaction" method
   * @param {string} privateKey private key to sign, in string format
   *
   * @returns the signed transaction
   */
  public abstract signRawTransaction(unsignedRaw: string, privateKey: PrivateKey): Promise<ISignedRawTransaction>;

  /**
   * Validate a transaction and broadcast it to the blockchain network
   *
   * @param {String} signedRawTx: the hex-encoded transaction data
   * @returns {String}: the transaction hash in hex
   */
  public abstract async sendRawTransaction(signedRawTx: string): Promise<ISubmittedTransaction>;

  /**
   * Re-construct raw transaction from output of "createRawTransaction" method
   * @param rawTx
   */
  public abstract reconstructRawTx(rawTx: string): IRawTransaction;
}
