import { BaseCrawler } from '..';
export declare abstract class NativeAssetCrawler extends BaseCrawler {
    protected processBlocks(fromBlockNumber: number, toBlockNumber: number, latestNetworkBlock: number): Promise<void>;
}
