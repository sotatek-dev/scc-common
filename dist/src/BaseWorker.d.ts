export declare abstract class BaseWorker {
    protected _isStarted: boolean;
    start(): void;
    protected onTick(): void;
    protected abstract prepare(): Promise<void>;
    protected abstract doProcess(): Promise<void>;
}
export default BaseWorker;
