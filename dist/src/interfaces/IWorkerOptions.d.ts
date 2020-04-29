import { BaseIntervalWorker } from '../BaseIntervalWorker';
import { BaseCurrencyWorker } from '../BaseCurrencyWorker';
import { BaseWorker } from '../BaseWorker';
export interface IIntervalWorkerOptions {
    readonly prepare: (worker: BaseIntervalWorker) => Promise<void>;
    readonly doProcess: (worker: BaseIntervalWorker) => Promise<void>;
}
export interface ICurrencyWorkerOptions {
    readonly prepare: (worker: BaseCurrencyWorker) => Promise<void>;
    readonly doProcess: (worker: BaseCurrencyWorker) => Promise<void>;
}
export interface IWorkerOptions {
    readonly prepare: (worker: BaseWorker) => Promise<void>;
    readonly doProcess: (worker: BaseWorker) => Promise<void>;
}
