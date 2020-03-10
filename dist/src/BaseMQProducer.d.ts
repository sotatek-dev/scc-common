import amqp, { Options } from 'amqplib';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function BaseMQProducer<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        _producerQueue: string;
        _producerChannel: amqp.Channel;
        setProducerQueueName(queueName: string): void;
        emitMessage(msg: string): Promise<boolean>;
        setupProducer(options: Options.Connect): Promise<void>;
    };
} & TBase;
export default BaseMQProducer;
