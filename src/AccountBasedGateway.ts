import BigNumber from 'bignumber.js';
import { IRawTransaction, IRawMultisigTransaction } from './interfaces';
import { BaseGateway } from './BaseGateway';
import { Address } from './types';

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
    amount: BigNumber,
    options: {
      isConsolidate?: boolean;
      destinationTag?: string;
      useLowerNetworkFee?: boolean;
      multisigConfig?: {
        signAddress: string;
      };
    }
  ): Promise<IRawTransaction>;

  public async construcRawMultisigCompleteAggregateTransaction(
    fromPublicKey: string,
    toAddress: string,
    value: BigNumber,
    options: {
      isConsolidate?: boolean;
      destinationTag?: string;
      multisigConfig: {
        signAddress: string;
      };
    }
  ): Promise<IRawMultisigTransaction> {
    throw new Error(`This currency don't support multisig transaction`);
  }

  public async construcRawLockTransaction(fromAddress: string, signedRawTx: string): Promise<IRawTransaction> {
    throw new Error('Method not implemented.');
  }
}
