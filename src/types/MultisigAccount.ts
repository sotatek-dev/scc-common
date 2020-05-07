import { Address } from './Address';
import { PrivateKey } from './PrivateKey';
import { PublicAccount } from './PublicAccount';
import { PublicKey } from './PublicKey';

export class MultisigAccount {
  public readonly address: Address;
  public readonly privateKey?: PrivateKey;
  public readonly publicKey: PublicKey;
  public readonly minApproval: number;
  public readonly minRemoval: number;
  public readonly cosignatories: PublicAccount[];
  constructor(
    address: Address,
    minApproval: number,
    minRemoval: number,
    cosignatories: PublicAccount[],
    publicKey: PublicKey,
    privateKey?: PrivateKey
  ) {
    this.address = address;
    this.privateKey = privateKey ? privateKey : null;
    this.minApproval = minApproval;
    this.minRemoval = minRemoval;
    this.cosignatories = cosignatories;
    this.publicKey = publicKey;
  }
}

export default MultisigAccount;
