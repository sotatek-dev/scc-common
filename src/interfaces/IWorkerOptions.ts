import BaseIntervalWorker from '../BaseIntervalWorker';

export interface IIntervalWorkerOptions {
  readonly prepare: (worker: BaseIntervalWorker) => Promise<void>;
  readonly doProcess: (worker: BaseIntervalWorker) => Promise<void>;
}
