import { getLogger } from '../Logger';
import { ICurrency } from '../interfaces/ICurrency';
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

const onCurrencyRegisteredCallbacks: Array<(currency: ICurrency) => void> = [];
const onERC20TokenRegisteredCallbacks: Array<(token: IErc20Token) => void> = [];
const onOmniAssetRegisteredCallbacks: Array<(asset: IOmniAsset) => void> = [];
const onCurrencyConfigSetCallbacks: Array<(currency: ICurrency, config: ICurrencyConfig) => void> = [];

/**
 * Built-in currencies
 */
const Bitcoin = {
  symbol: BlockchainPlatform.Bitcoin,
  networkSymbol: BlockchainPlatform.Bitcoin,
  name: 'Bitcoin',
  platform: BlockchainPlatform.Bitcoin,
  isNative: true,
  scale: 0,
};

const Ethereum = {
  symbol: BlockchainPlatform.Ethereum,
  networkSymbol: BlockchainPlatform.Ethereum,
  name: 'Ethereum',
  platform: BlockchainPlatform.Ethereum,
  isNative: true,
  scale: 0,
};

const Cardano = {
  symbol: BlockchainPlatform.Cardano,
  networkSymbol: BlockchainPlatform.Cardano,
  name: 'Cardano',
  platform: BlockchainPlatform.Cardano,
  isNative: true,
  scale: 0,
};

const BitcoinCash = {
  symbol: BlockchainPlatform.BitcoinCash,
  networkSymbol: BlockchainPlatform.BitcoinCash,
  name: 'BitcoinCash',
  platform: BlockchainPlatform.BitcoinCash,
  isNative: true,
  scale: 0,
};

const BitcoinSV = {
  symbol: BlockchainPlatform.BitcoinSV,
  networkSymbol: BlockchainPlatform.BitcoinSV,
  name: 'BitcoinSV',
  platform: BlockchainPlatform.BitcoinSV,
  isNative: true,
  scale: 0,
};

const EOS = {
  symbol: BlockchainPlatform.EOS,
  networkSymbol: BlockchainPlatform.EOS,
  name: 'EOS',
  platform: BlockchainPlatform.EOS,
  isNative: true,
  scale: 4,
};

const Litecoin = {
  symbol: BlockchainPlatform.Litecoin,
  networkSymbol: BlockchainPlatform.Litecoin,
  name: 'Litecoin',
  platform: BlockchainPlatform.Litecoin,
  isNative: true,
  scale: 0,
};

const Dash = {
  symbol: BlockchainPlatform.Dash,
  networkSymbol: BlockchainPlatform.Dash,
  name: 'Dash',
  platform: BlockchainPlatform.Dash,
  isNative: true,
  scale: 0,
};

const EthereumClasssic = {
  symbol: BlockchainPlatform.EthereumClassic,
  networkSymbol: BlockchainPlatform.EthereumClassic,
  name: 'EthereumClassic',
  platform: BlockchainPlatform.EthereumClassic,
  isNative: true,
  scale: 0,
};

const NEO = {
  symbol: BlockchainPlatform.NEO,
  networkSymbol: BlockchainPlatform.NEO,
  name: 'NEO',
  platform: BlockchainPlatform.NEO,
  isNative: true,
  scale: 0,
};

const NEOGAS = {
  symbol: 'gas',
  networkSymbol: 'gas',
  name: 'GAS',
  platform: BlockchainPlatform.NEO,
  isNative: true,
  scale: 0,
};

const Tomo = {
  symbol: BlockchainPlatform.Tomo,
  networkSymbol: BlockchainPlatform.Tomo,
  name: 'Tomo',
  platform: BlockchainPlatform.Tomo,
  isNative: true,
  scale: 0,
};

const Ripple = {
  symbol: BlockchainPlatform.Ripple,
  networkSymbol: BlockchainPlatform.Ripple,
  name: 'Ripple',
  platform: BlockchainPlatform.Ripple,
  isNative: true,
  scale: 6,
};

const Stellar = {
  symbol: BlockchainPlatform.Stellar,
  networkSymbol: BlockchainPlatform.Stellar,
  name: 'Stellar',
  platform: BlockchainPlatform.Stellar,
  isNative: true,
  scale: 6,
};

const nativeCurrencies: ICurrency[] = [
  Bitcoin,
  Ethereum,
  Cardano,
  BitcoinCash,
  BitcoinSV,
  EOS,
  Litecoin,
  Dash,
  EthereumClasssic,
  NEO,
  NEOGAS,
  Tomo,
  Ripple,
  Stellar,
];

export class CurrencyRegistry {
  public static readonly Bitcoin: ICurrency = Bitcoin;
  public static readonly Ethereum: ICurrency = Ethereum;
  public static readonly Cardano: ICurrency = Cardano;
  public static readonly BitcoinCash: ICurrency = BitcoinCash;
  public static readonly BitcoinSV: ICurrency = BitcoinSV;
  public static readonly EOS: ICurrency = EOS;
  public static readonly Litecoin: ICurrency = Litecoin;
  public static readonly Dash: ICurrency = Dash;
  public static readonly EthereumClasssic: ICurrency = EthereumClasssic;
  public static readonly NEO: ICurrency = NEO;
  public static readonly NEOGAS: ICurrency = NEOGAS;
  public static readonly Tomo: ICurrency = Tomo;
  public static readonly Ripple: ICurrency = Ripple;
  public static readonly Stellar: ICurrency = Stellar;

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
    onCurrencyRegisteredCallbacks.forEach(callback => callback(c));
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

    allOmniAssets.push(currency);
    onOmniAssetRegisteredCallbacks.forEach(callback => callback(currency));

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

    allErc20Tokens.push(currency);
    onERC20TokenRegisteredCallbacks.forEach(callback => callback(currency));

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
      throw new Error(`CCEnv::getOneCurrency cannot find currency has symbol: ${symbol}`);
    }

    return allCurrencies.get(symbol);
  }

  public static getOneNativeCurrency(symbol: BlockchainPlatform): ICurrency {
    if (!allCurrencies.has(symbol)) {
      throw new Error(`CCEnv::getOneNativeCurrency cannot find currency has symbol: ${symbol}`);
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
    onCurrencyConfigSetCallbacks.forEach(callback => callback(c, config));
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

  public static onCurrencyRegistered(callback: (currency: ICurrency) => void) {
    onCurrencyRegisteredCallbacks.push(callback);
  }

  public static onERC20TokenRegistered(callback: (token: IErc20Token) => void) {
    onERC20TokenRegisteredCallbacks.push(callback);
  }

  public static onOmniAssetRegistered(callback: (asset: IOmniAsset) => void) {
    onOmniAssetRegisteredCallbacks.push(callback);
  }

  public static onCurrencyConfigSet(callback: (currency: ICurrency, config: ICurrencyConfig) => void) {
    onCurrencyConfigSetCallbacks.push(callback);
  }
}

// Add native currencies to the list first
nativeCurrencies.forEach(c => CurrencyRegistry.registerCurrency(c));

export default CurrencyRegistry;
