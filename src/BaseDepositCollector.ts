import BaseWithdrawalWorker from './BaseWithdrawalWorker';
import { MessageQueueName } from './Enums';

export abstract class BaseDepositCollector extends BaseWithdrawalWorker {
  protected _nextTickTimer: number = 60 * 1000;
  public abstract getAddressEntity(): any;
  public abstract getNextCheckAtAmount(): number;

  /*
   * Check whether a deposit is collectable
   * There're a case the crawler crawl old deposit, which is already collected
   **/
  public async isCollectable(txid: string, address: string, amount: string): Promise<boolean> {
    return true;
  }

  protected getBaseConsumerQueue(): string {
    return '';
  }

  // Group them into transactions, and publish messages to signing queue
  protected getBaseProducerQueue(): string {
    return MessageQueueName.COLLECTING_DEPOSIT;
  }
}

export default BaseDepositCollector;
