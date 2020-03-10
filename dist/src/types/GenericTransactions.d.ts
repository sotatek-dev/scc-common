import { Transaction } from './Transaction';
export declare class GenericTransactions<T extends Transaction> extends Array<T> {
    constructor();
    groupByRecipients(): Map<string, GenericTransactions<T>>;
    mutableConcat(txs: T[]): void;
}
export default GenericTransactions;
