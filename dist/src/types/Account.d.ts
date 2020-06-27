import { Address } from './Address';
import { PrivateKey } from './PrivateKey';
export declare class Account {
    readonly address: Address;
    readonly privateKey: PrivateKey;
    constructor(privateKey: PrivateKey, address: Address);
}
export default Account;
