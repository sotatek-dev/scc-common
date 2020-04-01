import { Address } from './Address';
import { PrivateKey } from './PrivateKey';
import Account from './Account';

export class AccountHdWallet extends Account {
  public readonly fullPath;
  constructor(privateKey: PrivateKey, address: Address, fullPath) {
    super(privateKey, address);
    this.fullPath = fullPath;
  }
}

export default AccountHdWallet;
