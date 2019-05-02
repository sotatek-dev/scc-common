import BaseIntervalWorker2 from './BaseIntervalWorker2';
import BaseMQConsumer from './BaseMQConsumer';
import BaseMQProducer from './BaseMQProducer';
import { Options } from 'amqplib';
import { ICurrency, IIntervalWorkerOptions } from './interfaces';

const MixedClass = BaseMQConsumer(BaseMQProducer(BaseIntervalWorker2));

export abstract class BaseCurrencyWorker extends MixedClass {
  protected _currency: ICurrency;

  public constructor(currency: ICurrency, options: IIntervalWorkerOptions) {
    super();
    this._currency = currency;
    this._options = options;
  }

  public getCurrency(): ICurrency {
    return this._currency;
  }

  protected async _connect(options: Options.Connect): Promise<void> {
    await Promise.all([this.setupConsumer(options), this.setupProducer(options)]);
  }
}
