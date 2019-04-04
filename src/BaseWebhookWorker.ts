import amqp, { Options } from 'amqplib';
import util from 'util';
import { getAppId } from './EnvironmentData';
import { IWithdrawalProcessingResult } from './WithdrawalOptions';
import { getLogger } from './Logger';
import BaseGateway from './BaseGateway';
import BaseIntervalWorker from './BaseIntervalWorker';
import BaseMQConsumer from './BaseMQConsumer';
import BaseMQProducer from './BaseMQProducer';
const logger = getLogger('BaseWebhookWorker');

const MixedClass = BaseMQConsumer(BaseMQProducer(BaseIntervalWorker));

export abstract class BaseWebhookWorker extends MixedClass {
  public gateway: BaseGateway;

  private consumerQueues: string[];

  constructor() {
    super();
    const consumerQueue = this.getBaseConsumerQueue().split(',');
    this.consumerQueues = consumerQueue.map(q => {
      return getAppId() + '_' + q + '_' + 'webhook';
    });
    this._producerQueue = getAppId() + '_' + this.getBaseProducerQueue() + '_' + 'webhook';
  }

  /*protected*/ public async onConsumingMessage(msg: amqp.ConsumeMessage): Promise<boolean> {
    logger.info(`${this.constructor.name}::onConsumingMessage msg=${msg.content.toString()}`);
    await this.doProcess();

    // Messages are always consumed
    return true;
  }

  /*protected*/ public async setupConsumer(options: Options.Connect): Promise<void> {
    if (!this.consumerQueues) {
      logger.warn(`${this.constructor.name} has empty queue name. Just skip setup connection...`);
      return;
    }

    try {
      const connection = await amqp.connect(options);
      const channel = await connection.createChannel();
      this.consumerQueues.map(async consumerQueue => {
        await channel.assertQueue(consumerQueue, { durable: true });
        await channel.consume(consumerQueue, async msg => {
          try {
            const isConsumed = await this.onConsumingMessage(msg);
            if (isConsumed) {
              channel.ack(msg);
            } else {
              channel.nack(msg);
            }
          } catch (e) {
            logger.error(`${this.constructor.name} error when consuming msg=${util.inspect(msg)}`);
            logger.error(e);
            // Skip the msg that causes exception
            channel.ack(msg);
          }
        });
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  protected async connect(options: Options.Connect): Promise<void> {
    await Promise.all([this.setupConsumer(options), this.setupProducer(options)]);
  }

  protected async prepare(): Promise<void> {
    // await this.prepare();
    const protocol = process.env.RABBITMQ_SERVER_PROTOCOL || 'amqp';
    const hostname = process.env.RABBITMQ_SERVER_ADDRESS || '127.0.0.1';
    const port = parseInt(process.env.RABBITMQ_SERVER_PORT || '5672', 10);
    const options = {
      protocol,
      hostname,
      port,
    };
    await this.connect(options).catch(e => {
      logger.error(
        `${this.constructor.name}::prepare could not connect to rabbitmq server due to error: ${util.inspect(e)}`
      );
    });
  }

  protected async doProcess(): Promise<void> {
    const processResult = await this.doProcesser();
    if (processResult.needNextProcess) {
      this.emitMessage(processResult.withdrawalTxId.toString());
    }
  }

  protected abstract getBaseConsumerQueue(): string;
  protected abstract getBaseProducerQueue(): string;
  protected abstract doProcesser(): Promise<IWithdrawalProcessingResult>;
}

export default BaseWebhookWorker;
