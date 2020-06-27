import BaseWorker from './BaseWorker';
import { IWorkerOptions } from './interfaces';
export declare class BaseWorker2 extends BaseWorker {
    protected _options: IWorkerOptions;
    setOptions(options: IWorkerOptions): this;
    protected prepare(): Promise<void>;
    protected doProcess(): Promise<void>;
}
export default BaseWorker2;
