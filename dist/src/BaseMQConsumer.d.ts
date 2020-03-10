import amqp, { Options } from 'amqplib';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function BaseMQConsumer<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        _consumerQueue: string;
        setConsumerQueueName(queueName: string): void;
        onConsumingMessage(msg: amqp.ConsumeMessage): Promise<boolean>;
        setupConsumer(options: Options.Connect): Promise<void>;
    };
} & TBase;
export default BaseMQConsumer;
