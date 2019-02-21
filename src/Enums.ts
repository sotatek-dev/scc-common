export enum TransactionStatus {
  UNKNOWN = 0,
  CONFIRMING = 1,
  COMPLETED = 2,
  FAILED = 3,
}

export enum MessageQueueName {
  UNSIGNED_WITHDRAWAL = 'unsigned_withdrawal',
  SIGNING_WITHDRAWAL = 'signing_withdrawal',
  SIGNED_WITHDRAWAL = 'signed_withdrawal',
  SENT_WITHDRAWAL = 'sent_withdrawal',
  VERIFIED_WITHDRAWAL = 'verified_withdrawal',

  COLLECTING_DEPOSIT = 'collecting_deposit',
  COLLECTED_DEPOSIT = 'collected_deposit',
}

export enum HotWalletType {
  Normal = 'normal',
  Multisig = 'multisig',
}

interface IError {
  [index: string]: ErrorDetails;
}

class ErrorDetails {
  public message: string;
  public code: number;
  constructor(message: string, code: number) {
    this.message = message;
    this.code = code;
  }
  public toString(): string {
    return this.message;
  }
}

export const Errors: IError = {};
Errors.unImplementedError = new ErrorDetails('implement me', 1818);
Errors.rpcError = new ErrorDetails('rpc node error', 1819);
Errors.apiEndpointError = new ErrorDetails('api node error', 1819);
