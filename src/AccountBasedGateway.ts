import { BaseGateway, IRawTransaction, ISignedRawTransaction, ISubmittedTransaction } from '..';
import BigNumber from 'bignumber.js';
import { PrivateKey, Address } from './types';

export abstract class AccountBasedGateway extends BaseGateway {
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
    fromAddress: Address,
    toAddress: Address,
    amount: BigNumber
  ): Promise<IRawTransaction>;

  /**
   * Sign a raw transaction with single private key
   * Most likely is used to sign transaction sent from normal hot wallet
   *
   * @param {string} unsignedRaw is result of "createRawTransaction" method
   * @param {string} privateKey private key to sign, in string format
   *
   * @returns the signed transaction
   */
  public abstract async signRawTransaction(unsignedRaw: string, secret: string): Promise<ISignedRawTransaction>;

  /**
   * Validate a transaction and broadcast it to the blockchain network
   *
   * @param {String} signedRawTx: the hex-encoded transaction data
   * @returns {String}: the transaction hash in hex
   */
  public abstract async sendRawTransaction(signedRawTx: string): Promise<ISubmittedTransaction>;
}
