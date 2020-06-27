import BaseIntervalWorker2 from './BaseIntervalWorker2';
import { ICurrency, ICurrencyWorkerOptions } from './interfaces';
export declare class BaseCurrencyWorker extends BaseIntervalWorker2 {
    protected _currency: ICurrency;
    constructor(currency: ICurrency, options: ICurrencyWorkerOptions);
    getCurrency(): ICurrency;
}
