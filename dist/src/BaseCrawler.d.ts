import BaseGateway from './BaseGateway';
import BaseIntervalWorker from './BaseIntervalWorker';
import { Block, Transactions } from './types';
import { ICurrency } from './interfaces';
import { BlockchainPlatform } from './enums';
export interface ICrawlerOptions {
    readonly getLatestCrawledBlockNumber: (crawler: BaseCrawler) => Promise<number>;
    readonly onBlockCrawled: (crawler: BaseCrawler, block: Block) => Promise<void>;
    readonly onCrawlingTxs: (crawler: BaseCrawler, txs: Transactions) => Promise<void>;
}
export declare abstract class BaseCrawler extends BaseIntervalWorker {
    protected readonly _id: string;
    protected readonly _options: ICrawlerOptions;
    protected readonly _nativeCurrency: ICurrency;
    constructor(platform: BlockchainPlatform, options: ICrawlerOptions);
    getInstanceId(): string;
    getOptions(): ICrawlerOptions;
    getNativeCurrency(): ICurrency;
    getCrawlType(): string;
    getBlockNumInOneGo(): number;
    getAverageBlockTime(): number;
    getRequiredConfirmations(): number;
    getPlatformGateway(): BaseGateway;
    protected prepare(): Promise<void>;
    protected doProcess(): Promise<void>;
    protected abstract processBlocks(fromBlock: number, toBlock: number, latestBlock: number): Promise<void>;
}
export default BaseCrawler;
