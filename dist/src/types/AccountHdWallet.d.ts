import { Address } from './Address';
import { PrivateKey } from './PrivateKey';
import Account from './Account';
export declare class AccountHdWallet extends Account {
    readonly fullPath: string;
    constructor(privateKey: PrivateKey, address: Address, fullPath: string);
}
export default AccountHdWallet;
