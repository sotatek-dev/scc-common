import { BaseCurrencyWorker } from './BaseCurrencyWorker';
import { BlockchainPlatform } from './enums';
import { ICurrencyWorkerOptions } from './interfaces';
export declare class BasePlatformWorker extends BaseCurrencyWorker {
    constructor(platform: BlockchainPlatform, options: ICurrencyWorkerOptions);
}
export default BasePlatformWorker;
