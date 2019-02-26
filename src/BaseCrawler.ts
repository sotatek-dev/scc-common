import { v1 as uuid } from 'uuid';
import { getLogger } from './Logger';
import BaseGateway from './BaseGateway';
import CrawlerOptions from './CrawlerOptions';
import { getListTokenSymbols, getTokenBySymbol } from './EnvironmentData';

const logger = getLogger('BaseCrawler');

export abstract class BaseCrawler {
  public _gateway: BaseGateway;
  private readonly _id: string;
  private readonly _options: CrawlerOptions;

  constructor(options: CrawlerOptions) {
    const contractAddresses: string[] = [];
    const tokensObj = getListTokenSymbols();

    tokensObj.tokenSymbols.map((tokenSymbol: string) => {
      const token = getTokenBySymbol(tokenSymbol);
      if (!token) {
        throw new Error(`Could not find token in config: symbol=${tokenSymbol}, network=${process.env.NETWORK}`);
      }
      if (token.contractAddress) {
        contractAddresses.push(token.contractAddress);
      }
    });

    this._gateway = this.gatewayClass().getInstance();
    this._id = uuid();
    this._options = options;
  }

  public abstract gatewayClass(): any;

  public getGateway(): BaseGateway {
    return this._gateway;
  }

  public getInstanceId(): string {
    return this._id;
  }

  public getOptions(): CrawlerOptions {
    return this._options;
  }

  /**
   * Decide number of blocks to get in one time based on
   * number of currency when crawling
   * and required confirmations
   */
  public getBlockNumInOneGo(): number {
    if (this.getGateway().isFastGateway()) {
      return 50;
    }
    return this.getRequiredConfirmations() + 1;
  }

  public getTxNumInOneGo(): number {
    return 10;
  }

  public abstract getFirstBlockNumberToCrawl(): number;

  public abstract getAverageBlockTime(): number;

  public abstract getRequiredConfirmations(): number;

  public async getLatestBlockOnNetwork(): Promise<number> {
    return await this.getGateway().getBlockCount();
  }

  public getCrawlType(): string {
    return this._options.crawlType;
  }

  /**
   * Process several blocks in one go. Just use single database transaction
   * @param {number} fromBlockNumber - begin of crawling blocks range
   * @param {number} toBlockNumber - end of crawling blocks range
   * @param {number} latestNetworkBlock - recent height of blockchain in the network
   *
   * @returns {number} the highest block that is considered as confirmed
   */
  public async processBlocks(
    fromBlockNumber: number,
    toBlockNumber: number,
    latestNetworkBlock: number
  ): Promise<void> {
    const symbol = getListTokenSymbols().tokenSymbolsBuilder.toUpperCase();
    logger.info(`${symbol}::processBlocks BEGIN: ${fromBlockNumber}→${toBlockNumber} / ${latestNetworkBlock}`);

    // Get all transactions in the block
    const allTxs = await this.getGateway().getMultiBlocksTransactions(fromBlockNumber, toBlockNumber);

    // Use callback to process all crawled transactions
    await this._options.onCrawlingTxs(this, allTxs);

    logger.info(`${symbol}::_processBlocks FINISH: ${fromBlockNumber}→${toBlockNumber}, txs=${allTxs.length}`);
  }
}

export default BaseCrawler;
