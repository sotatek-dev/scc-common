import BigNumber from 'bignumber.js';
import { IRawTransaction } from './interfaces';
import { BaseGateway } from './BaseGateway';
import { Address } from './types';
export declare abstract class AccountBasedGateway extends BaseGateway {
    abstract constructRawTransaction(fromAddress: Address, toAddress: Address, amount: BigNumber, options: {
        isConsolidate?: boolean;
        destinationTag?: string;
        useLowerNetworkFee?: boolean;
    }): Promise<IRawTransaction>;
}
