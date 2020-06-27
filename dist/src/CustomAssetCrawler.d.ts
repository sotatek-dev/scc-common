import { ICurrency } from './interfaces';
import { NativeAssetCrawler } from './NativeAssetCrawler';
import { ICrawlerOptions } from './BaseCrawler';
export declare abstract class CustomAssetCrawler extends NativeAssetCrawler {
    protected readonly _currencies: ICurrency[];
    constructor(options: ICrawlerOptions, currencies: ICurrency[]);
    protected processBlocks(fromBlockNumber: number, toBlockNumber: number, latestNetworkBlock: number): Promise<void>;
}
