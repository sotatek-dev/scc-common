import { Address } from './Address';
import { PublicKey } from './PublicKey';

export class PublicAccount {
  public readonly publicKey: PublicKey;
  public readonly address: Address;
  constructor(publicKey: PublicKey, address: Address) {
    this.address = address;
    this.publicKey = publicKey;
  }
}

export default PublicAccount;
