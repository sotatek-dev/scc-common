import { getLogger } from './Logger';

const logger = getLogger('BaseWorker');

export abstract class BaseWorker {
  // Guarding flag to prevent the worker from starting multiple times
  protected _isStarted: boolean = false;

  /**
   * The worker begins
   */
  public start(): void {
    if (this._isStarted) {
      logger.warn(`${this.constructor.name} Trying to start processor twice...`);
      return;
    }

    this._isStarted = true;

    this.prepare()
      .then(res => {
        logger.info(`${this.constructor.name} finished preparing. Will start the first tick shortly...`);
        this.onTick();
      })
      .catch(err => {
        throw err;
      });
  }

  protected onTick(): void {
    this.doProcess().catch(err => {
      logger.error(`${this.constructor.name} is restarted due to error: `, err);
      setTimeout(() => {
        this.onTick();
      }, 30000);
    });
  }

  // Should be overridden in derived classes
  // to setup connections, listeners, ... here
  protected abstract async prepare(): Promise<void>;

  // Should be overridden in derived classes
  // Main logic will come to here
  protected abstract async doProcess(): Promise<void>;
}

export default BaseWorker;
