import BaseCrawler from './BaseCrawler';
import { Block, Transaction, Transactions } from './types';

export class CrawlerOptions {
  public readonly crawlType: string;
  public readonly getLatestCrawledBlockNumber: (crawler: BaseCrawler) => Promise<number>;
  public readonly onBlockCrawled: (crawler: BaseCrawler, block: Block) => Promise<void>;
  public readonly onTxCrawled: (crawler: BaseCrawler, tx: Transaction) => Promise<void>;
  public readonly onCrawlingTxs: (crawler: BaseCrawler, txs: Transactions) => Promise<void>;
}

export default CrawlerOptions;
