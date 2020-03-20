import BaseWorker from './BaseWorker';
import { IWorkerOptions } from './interfaces';

/**
 * The basic differences from BaseWorker is
 * logic of prepare and doProcess method are decoupled from the worker class
 */
export class BaseWorker2 extends BaseWorker {
  protected _options: IWorkerOptions;

  public setOptions(options: IWorkerOptions) {
    this._options = options;
    return this;
  }

  protected async prepare() {
    await this._options.prepare(this);
  }

  protected async doProcess() {
    await this._options.doProcess(this);
  }
}

export default BaseWorker2;
