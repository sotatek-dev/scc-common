import { BaseGateway, NativeAssetCrawler, ICurrency, ICrawlerOptions, Utils, getLogger } from '..';
import { CurrencyRegistry } from './registries';

const logger = getLogger('CustomAssetCrawler');
/**
 * Token means custom assets, not the native ones
 * Like ERC20 tokens on Ethereum platform, Omni assets on Bitcoin platform, ...
 */

export abstract class CustomAssetCrawler extends NativeAssetCrawler {
  protected readonly _currencies: ICurrency[];

  constructor(currencies: ICurrency[], options: ICrawlerOptions) {
    const nativeCurrency = CurrencyRegistry.getOneNativeCurrency(currencies[0].platform);
    super(nativeCurrency, options);
    this._currencies = currencies;
  }

  public abstract getGateway(currency: ICurrency): BaseGateway;

  /**
   * Process several blocks in one go. Just use single database transaction
   * @param {number} fromBlockNumber - begin of crawling blocks range
   * @param {number} toBlockNumber - end of crawling blocks range
   * @param {number} latestNetworkBlock - recent height of blockchain in the network
   *
   * @returns {number} the highest block that is considered as confirmed
   */
  protected async processBlocks(
    fromBlockNumber: number,
    toBlockNumber: number,
    latestNetworkBlock: number
  ): Promise<void> {
    await Utils.PromiseAll(
      this._currencies.map(async c => {
        logger.info(`${c.symbol}::processBlocks BEGIN: ${fromBlockNumber}→${toBlockNumber} / ${latestNetworkBlock}`);
        const gateway = this.getGateway(c);

        // Get all transactions in the block
        const allTxs = await gateway.getMultiBlocksTransactions(fromBlockNumber, toBlockNumber);

        // Use callback to process all crawled transactions
        await this._options.onCrawlingTxs(this, allTxs);

        logger.info(`${c.symbol}::_processBlocks FINISH: ${fromBlockNumber}→${toBlockNumber}, txs=${allTxs.length}`);
      })
    );
  }
}
