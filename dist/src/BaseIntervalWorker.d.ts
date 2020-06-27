export declare abstract class BaseIntervalWorker {
    protected _isStarted: boolean;
    protected _nextTickTimer: number;
    protected _processingTimeout: number;
    start(): void;
    getNextTickTimer(): number;
    getProcessingTimeout(): number;
    protected setNextTickTimer(timeout: number): void;
    protected setProcessingTimeout(timeout: number): void;
    protected onTick(): void;
    protected getWorkerInfo(): string;
    protected abstract prepare(): Promise<void>;
    protected abstract doProcess(): Promise<void>;
}
export default BaseIntervalWorker;
