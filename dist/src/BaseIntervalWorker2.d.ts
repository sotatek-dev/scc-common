import BaseIntervalWorker from './BaseIntervalWorker';
import { IIntervalWorkerOptions } from './interfaces';
export declare class BaseIntervalWorker2 extends BaseIntervalWorker {
    protected _options: IIntervalWorkerOptions;
    CurrencyIntervalWorker2(options: IIntervalWorkerOptions): void;
    protected prepare(): Promise<void>;
    protected doProcess(): Promise<void>;
}
export default BaseIntervalWorker2;
