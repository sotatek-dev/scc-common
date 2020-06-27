import BaseCrawler from './BaseCrawler';
export declare class BitcoinBasedCrawler extends BaseCrawler {
    protected processBlocks(fromBlock: number, toBlock: number, latestNetworkBlock: number): Promise<void>;
}
