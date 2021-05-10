import BaseCrawler from "./BaseCrawler";
import { CurrencyRegistry, GatewayRegistry } from "./registries";
import { getLogger } from "./Logger";
import * as Utils from "./Utils";
import pLimit from "p-limit";
const limit = pLimit(1);

const logger = getLogger("BasePlatformCrawler2");

export class BasePlatformCrawler2 extends BaseCrawler {

  /**
   * Process several blocks in one go. Just use single database transaction
   * @param {number} fromBlock - begin of crawling blocks range
   * @param {number} toBlock - end of crawling blocks range
   * @param {number} latestNetworkBlock - recent height of blockchain in the network
   */
  protected async processBlocks(
    fromBlock: number,
    toBlock: number,
    latestNetworkBlock: number
  ) {
    //process the blocks using the api gateway of the native currency
    //and using the default api gateway of the token type
    //instead of using the api gateway of each token
    const typeTokens = CurrencyRegistry.getTypeTokensOfPlatform(
      this._nativeCurrency.platform
    );

    const tasks: Array<Promise<any>> = [];

    const allCurrencies = CurrencyRegistry.getCurrenciesOfPlatform(
      this._nativeCurrency.platform
    );

    // check if it is necessary to collect transactions using native currency
    if (allCurrencies.includes(this._nativeCurrency)) {
      tasks.push(
        limit(async () => {
          const nativeGateway = GatewayRegistry.getGatewayInstance(
            this._nativeCurrency
          );
          if(!nativeGateway){
            throw new Error(`${this.constructor.name}::Could not get gateway instance for currency: ${this._nativeCurrency.symbol}`)
          }
          // Get all transactions in the block
          const allTxs = await nativeGateway.getMultiBlocksTransactions(
            fromBlock,
            toBlock
          );

          logger.info(
            `${this.constructor.name}::processBlocks processing ${allTxs.length} transactions`

          );
          // Use callback to process all crawled transactions
          await this._options.onCrawlingTxs(this, allTxs);

          const extraInfo = {
            networkSymbol: this._nativeCurrency.networkSymbol,
            fullSymbol: this._nativeCurrency.symbol,
            fromBlock,
            toBlock,
            latestNetworkBlock,
            txs: allTxs.length,
          };
          logger.info(
            `${this.constructor.name}::processBlocks finished`,
            extraInfo
          );
        })
      );
    }

    // check if it is necessary to collect transactions using token
    if (typeTokens.length) {
      tasks.push(
        ...typeTokens.map(async (type) =>
          limit(async () => {
            //get gateway instance of the token type
            const tokenGateway = GatewayRegistry.getGatewayInstance(type);
            if(!tokenGateway){
              throw new Error(`${this.constructor.name}::Could not get default gateway instance for token: ${type}`)
            }
            // Get all transactions in the block
            const allTxs = await tokenGateway.getMultiBlocksTransactions(
              fromBlock,
              toBlock
            );

            logger.info(
              `${this.constructor.name}::processBlocks processing ${allTxs.length} transactions`
            );

            // Use callback to process all crawled transactions
            await this._options.onCrawlingTxs(this, allTxs);

            const extraInfo = {
              networkSymbol: this._nativeCurrency.networkSymbol,
              token: type,
              fromBlock,
              toBlock,
              latestNetworkBlock,
              txs: allTxs.length,
            };
            logger.info(
              `${this.constructor.name}::processBlocks finished`,
              extraInfo
            );
          })
        )
      );
    }
    await Utils.PromiseAll(tasks);
  }
}
