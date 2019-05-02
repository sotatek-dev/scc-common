import { getLogger } from '../Logger';
import { ICurrency, nativeCurrencies } from '../interfaces/ICurrency';
import { ICurrencyConfig, IOmniAsset, IErc20Token } from '../interfaces';
import { BlockchainPlatform, TokenType } from '../enums';

/**
 * Environment data is usually loaded from database at runtime
 * These are some pre-defined types of data
 * Is there any case we need to defined it as generic?
 */
const logger = getLogger('CurrencyRegistry');
const allCurrencies = new Map<string, ICurrency>();
const allCurrencyConfigs = new Map<string, ICurrencyConfig>();
const allErc20Tokens: IErc20Token[] = [];
const allOmniAssets: IOmniAsset[] = [];

// Add native currencies to the list first
nativeCurrencies.forEach(c => CurrencyRegistry.registerCurrency(c));

export class CurrencyRegistry {
  /**
   * Register a currency on environment data
   * Native assets have been registered above
   * Most likely the tokens or other kind of programmatic assets will be added here
   *
   * @param c currency
   */
  public static registerCurrency(c: ICurrency): boolean {
    if (allCurrencies.has(c.symbol)) {
      logger.warn(`Currency register multiple times: ${c.symbol}`);
      return false;
    }

    allCurrencies.set(c.symbol, c);
    return true;
  }

  public static registerOmniAsset(propertyId: number, networkSymbol: string, name: string, scale: number): boolean {
    logger.info(
      `register Omni: propertyId=${propertyId}, networkSymbol=${networkSymbol}, name=${name}, scale=${scale}`
    );
    const platform = BlockchainPlatform.Bitcoin;
    const symbol = [TokenType.OMNI, propertyId].join('.');
    const currency: IOmniAsset = {
      symbol,
      networkSymbol,
      tokenType: TokenType.OMNI,
      name,
      platform,
      isNative: false,
      propertyId,
      scale,
    };

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static registerErc20Token(
    contractAddress: string,
    networkSymbol: string,
    name: string,
    decimals: number
  ): boolean {
    logger.info(
      `register erc20: contract=${contractAddress}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`
    );
    const platform = BlockchainPlatform.Ethereum;
    const symbol = [TokenType.ERC20, contractAddress].join('.');
    const currency: IErc20Token = {
      symbol,
      networkSymbol,
      tokenType: TokenType.ERC20,
      name,
      platform,
      isNative: false,
      contractAddress,
      decimals,
      scale: 0,
    };

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static getOneOmniAsset(propertyId: number): IOmniAsset {
    const symbol = [TokenType.OMNI, propertyId].join('.');
    return CurrencyRegistry.getOneCurrency(symbol) as IOmniAsset;
  }

  public static getAllOmniAssets(): IOmniAsset[] {
    return allOmniAssets;
  }

  public static getOneErc20Token(contractAddress: string): IErc20Token {
    const symbol = [TokenType.ERC20, contractAddress].join('.');
    return CurrencyRegistry.getOneCurrency(symbol) as IErc20Token;
  }

  public static getAllErc20Tokens(): IErc20Token[] {
    return allErc20Tokens;
  }

  /**
   * Just return all currencies that were registered
   */
  public static getAllCurrencies(): ICurrency[] {
    return Array.from(allCurrencies.values());
  }

  /**
   * Get information of one currency by its symbol
   *
   * @param symbol
   */
  public static getOneCurrency(symbol: string): ICurrency {
    if (!allCurrencies.has(symbol)) {
      logger.error(`CCEnv::getOneCurrency cannot find currency has symbol: ${symbol}`);
      return null;
    }

    return allCurrencies.get(symbol);
  }

  public static getOneNativeCurrency(symbol: BlockchainPlatform): ICurrency {
    if (!allCurrencies.has(symbol)) {
      logger.error(`CCEnv::getOneNativeCurrency cannot find currency has symbol: ${symbol}`);
      return null;
    }

    return allCurrencies.get(symbol);
  }

  /**
   * Update config for a currency
   *
   * @param c
   * @param config
   */
  public static setCurrencyConfig(c: ICurrency, config: ICurrencyConfig) {
    const symbol = c.symbol;
    let finalConfig: ICurrencyConfig;

    // Keep configs that is already set on the environment
    if (allCurrencyConfigs.has(symbol)) {
      const oldConfig = allCurrencyConfigs.get(symbol);
      finalConfig = Object.assign({}, finalConfig, oldConfig);
    }

    // And merge it with desired config
    finalConfig = Object.assign({}, finalConfig, config);

    logger.info(`setCurrencyConfig: symbol=${symbol}, config=${JSON.stringify(finalConfig)}`);

    // Put it to the environment again
    allCurrencyConfigs.set(symbol, finalConfig);
  }

  /**
   * Get config of a single currency
   * @param c
   */
  public static getCurrencyConfig(c: ICurrency): ICurrencyConfig {
    const symbol = c.symbol;
    if (!allCurrencies.has(symbol)) {
      logger.error(`CCEnv::getOneCurrencyConfig cannot find currency has symbol: ${symbol}`);
      return null;
    }

    return allCurrencyConfigs.get(symbol);
  }
}

export default CurrencyRegistry;
