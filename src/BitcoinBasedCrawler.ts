import BaseCrawler from './BaseCrawler';
import { CurrencyRegistry, GatewayRegistry } from './registries';
import { getLogger } from './Logger';
import * as Utils from './Utils';
import { Transactions } from './types';

const logger = getLogger('BitcoinBasedCrawler');

export class BitcoinBasedCrawler extends BaseCrawler {
  /**
   * Process several blocks in one go. Just use single database transaction
   * @param {number} fromBlock - begin of crawling blocks range
   * @param {number} toBlock - end of crawling blocks range
   * @param {number} latestNetworkBlock - recent height of blockchain in the network
   */
  protected async processBlocks(fromBlock: number, toBlock: number, latestNetworkBlock: number): Promise<void> {
    const allCurrencies = CurrencyRegistry.getCurrenciesOfPlatform(this._nativeCurrency.platform);
    await Utils.PromiseAll(
      allCurrencies.map(async c => {
        const gateway = GatewayRegistry.getGatewayInstance(c);

        // Get all transactions in the block
        const allTxs = await gateway.getMultiBlocksTransactions(fromBlock, toBlock);
        // chunk transactions
        const roundCounter = Math.ceil(allTxs.length / 5000);
        const round = Array.from(Array(roundCounter).keys());
        for (const r of round) {
          const allTxsInRound = allTxs.slice(r * 5000, (r + 1) * 5000) as Transactions;
          // Use callback to process all crawled transactions
          await this._options.onCrawlingTxs(this, allTxsInRound);
        }

        const extraData = { fromBlock, toBlock, latestNetworkBlock, txs: allTxs.length };
        logger.info(`${this.constructor.name}::processBlocks finished`, extraData);
      })
    );
  }
}
