import BaseCrawler from "./BaseCrawler";
export declare class BasePlatformCrawler2 extends BaseCrawler {
    protected processBlocks(fromBlock: number, toBlock: number, latestNetworkBlock: number): Promise<void>;
}
