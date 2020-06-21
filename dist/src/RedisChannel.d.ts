import { RedisClient } from 'redis';
export declare function getRedisSubscriber(customChannel?: string): RedisClient;
interface IRedisPromiseClient {
    setex(key: string, seconds: number, value: string): Promise<string>;
    set(key: string, value: string): Promise<string>;
    get(key: string): Promise<string>;
    publish(channel: string, message: string): Promise<string>;
}
export declare function getRedisClient(): IRedisPromiseClient;
export {};
