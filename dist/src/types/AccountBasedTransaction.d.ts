import BigNumber from 'bignumber.js';
import { ICurrency } from '../interfaces';
import { Address } from './Address';
import { Transaction } from './Transaction';
import { BlockHeader } from './BlockHeader';
import { TransferEntry } from './TransferEntry';
interface IAccountBasedTransactionProps {
    readonly txid: string;
    readonly height: number;
    readonly timestamp: number;
    confirmations: number;
    readonly fromAddress: Address;
    readonly toAddress: Address;
    readonly amount: BigNumber;
}
export declare abstract class AccountBasedTransaction extends Transaction {
    readonly fromAddress: Address;
    readonly toAddress: Address;
    readonly amount: BigNumber;
    readonly currency: ICurrency;
    constructor(currency: ICurrency, tx: IAccountBasedTransactionProps, block: BlockHeader);
    _extractEntries(): TransferEntry[];
}
export {};
