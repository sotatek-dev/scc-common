import { getLogger } from '../Logger';
import { ICurrency, IEosToken, IErc20TokenTomo, IBepToken, ITerraToken, ICosmosToken, IBep20Token, ITrc20Token, ISplToken } from '../interfaces/ICurrency';
import { ICurrencyConfig, IOmniAsset, IErc20Token } from '../interfaces';
import { BlockchainPlatform, TokenType, TransactionBaseType } from '../enums';
import { Block } from '../types';

/**
 * Environment data is usually loaded from database at runtime
 * These are some pre-defined types of data
 * Is there any case we need to defined it as generic?
 */
const logger = getLogger('CurrencyRegistry');
const allCurrencies = new Map<string, ICurrency>();
const allCurrencyConfigs = new Map<string, ICurrencyConfig>();
const allErc20Tokens: IErc20Token[] = [];
const allPolErc20Tokens: IErc20Token[] = [];
const allTrc20Tokens: IErc20TokenTomo[] = [];
const allOmniAssets: IOmniAsset[] = [];
const allEosTokens: IEosToken[] = [];
const allBepTokens: IBepToken[] = [];
const allBep20Tokens: IBep20Token[] = [];
const allTerraTokens: ITerraToken[] = [];
const allCosmosTokens: ICosmosToken[] = [];
const allTronTrc20Tokens: ITrc20Token[] = [];
const allSplToken: ISplToken[] = [];

const onCurrencyRegisteredCallbacks: Array<(currency: ICurrency) => void> = [];
const onSpecificCurrencyRegisteredCallbacks = new Map<string, Array<() => void>>();
const onCurrencyConfigSetCallbacks: Array<(currency: ICurrency, config: ICurrencyConfig) => void> = [];

const eventCallbacks = {
  'erc20-registered': Array<(token: IErc20Token) => void>(),
  'polErc20-registered': Array<(token: IErc20Token) => void>(),
  'trc20-registered': Array<(token: IErc20TokenTomo) => void>(),
  'omni-registered': Array<(asset: IOmniAsset) => void>(),
  'eos-token-registered': Array<(asset: IEosToken) => void>(),
  'bep-token-registered': Array<(asset: IBepToken) => void>(),
  'bep20-token-registered': Array<(asset: IBep20Token) => void>(),
  'terra-token-registered': Array<(asset: ITerraToken) => void>(),
  'cosmos-token-registered': Array<(asset: ICosmosToken) => void>(),
  'tronTrc20-registered': Array<(asset: ITrc20Token) => void>(),
  'spl-token-registered': Array<(asset: ISplToken) => void>(),
};

/**
 * Built-in currencies
 */
const Bitcoin = {
  symbol: BlockchainPlatform.Bitcoin,
  networkSymbol: BlockchainPlatform.Bitcoin,
  name: 'Bitcoin',
  platform: BlockchainPlatform.Bitcoin,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: false,
};

const Ethereum = {
  symbol: BlockchainPlatform.Ethereum,
  networkSymbol: BlockchainPlatform.Ethereum,
  name: 'Ethereum',
  platform: BlockchainPlatform.Ethereum,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 18,
  nativeScale: 0,
  hasMemo: false,
};

const Polygon = {
  symbol: BlockchainPlatform.Polygon,
  networkSymbol: BlockchainPlatform.Polygon,
  name: 'Polygon',
  platform: BlockchainPlatform.Polygon,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 18,
  nativeScale: 0,
  hasMemo: false,
}

const Cardano = {
  symbol: BlockchainPlatform.Cardano,
  networkSymbol: BlockchainPlatform.Cardano,
  name: 'Cardano',
  platform: BlockchainPlatform.Cardano,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 6,
  nativeScale: 0,
  hasMemo: false,
};

const BitcoinCash = {
  symbol: BlockchainPlatform.BitcoinCash,
  networkSymbol: BlockchainPlatform.BitcoinCash,
  name: 'BitcoinCash',
  platform: BlockchainPlatform.BitcoinCash,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: false,
};

const BitcoinSV = {
  symbol: BlockchainPlatform.BitcoinSV,
  networkSymbol: BlockchainPlatform.BitcoinSV,
  name: 'BitcoinSV',
  platform: BlockchainPlatform.BitcoinSV,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: false,
};

const EOS = {
  symbol: BlockchainPlatform.EOS,
  networkSymbol: BlockchainPlatform.EOS,
  name: 'EOS',
  platform: BlockchainPlatform.EOS,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 0,
  nativeScale: 4,
  hasMemo: true,
};

const Litecoin = {
  symbol: BlockchainPlatform.Litecoin,
  networkSymbol: BlockchainPlatform.Litecoin,
  name: 'Litecoin',
  platform: BlockchainPlatform.Litecoin,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: false,
};

const Dash = {
  symbol: BlockchainPlatform.Dash,
  networkSymbol: BlockchainPlatform.Dash,
  name: 'Dash',
  platform: BlockchainPlatform.Dash,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: false,
};

const EthereumClasssic = {
  symbol: BlockchainPlatform.EthereumClassic,
  networkSymbol: BlockchainPlatform.EthereumClassic,
  name: 'EthereumClassic',
  platform: BlockchainPlatform.EthereumClassic,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 18,
  nativeScale: 0,
  hasMemo: false,
};

const NEO = {
  symbol: BlockchainPlatform.NEO,
  networkSymbol: BlockchainPlatform.NEO,
  name: 'NEO',
  platform: BlockchainPlatform.NEO,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 0,
  nativeScale: 0,
  hasMemo: false,
};

const NEOGAS = {
  symbol: 'gas',
  networkSymbol: 'gas',
  name: 'GAS',
  platform: BlockchainPlatform.NEO,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 0,
  nativeScale: 8,
  hasMemo: false,
};

const Tomo = {
  symbol: BlockchainPlatform.Tomo,
  networkSymbol: BlockchainPlatform.Tomo,
  name: 'Tomo',
  platform: BlockchainPlatform.Tomo,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 18,
  nativeScale: 0,
  hasMemo: false,
};

const Ripple = {
  symbol: BlockchainPlatform.Ripple,
  networkSymbol: BlockchainPlatform.Ripple,
  name: 'Ripple',
  platform: BlockchainPlatform.Ripple,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 0,
  nativeScale: 6,
  hasMemo: true,
};

const Stellar = {
  symbol: BlockchainPlatform.Stellar,
  networkSymbol: BlockchainPlatform.Stellar,
  name: 'Stellar',
  platform: BlockchainPlatform.Stellar,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 0,
  nativeScale: 6,
  hasMemo: true,
};

const Nem = {
  symbol: BlockchainPlatform.Nem,
  networkSymbol: BlockchainPlatform.Nem,
  name: 'XEM',
  platform: BlockchainPlatform.Nem,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 6,
  nativeScale: 0,
  hasMemo: true,
};

const Tron = {
  symbol: BlockchainPlatform.Tron,
  networkSymbol: BlockchainPlatform.Tron,
  name: 'Tron',
  platform: BlockchainPlatform.Tron,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 8,
  nativeScale: 6,
  hasMemo: false,
};

const Binance = {
  symbol: BlockchainPlatform.Binance,
  networkSymbol: BlockchainPlatform.Binance,
  name: 'Binance',
  platform: BlockchainPlatform.Binance,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: true,
};

const BinanceCoin = {
  symbol: BlockchainPlatform.BinanceSmartChain,
  networkSymbol: BlockchainPlatform.BinanceSmartChain,
  name: 'Binance Chain Native Token',
  platform: BlockchainPlatform.BinanceSmartChain,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 18,
    nativeScale: 0,
  hasMemo: false,
  family: BlockchainPlatform.Ethereum,
};

const Terra = {
  symbol: BlockchainPlatform.Terra,
  networkSymbol: BlockchainPlatform.Terra,
  name: 'Terra',
  platform: BlockchainPlatform.Terra,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 8,
  type: TransactionBaseType.COSMOS,
  nativeScale: 0,
  hdPath: `m/44'/330'/0'/0/`,
  hasMemo: true,
};

const Cosmos = {
  symbol: BlockchainPlatform.Cosmos,
  networkSymbol: BlockchainPlatform.Cosmos,
  name: 'Cosmos',
  platform: BlockchainPlatform.Cosmos,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 8,
  type: TransactionBaseType.COSMOS,
  nativeScale: 0,
  hdPath: `m/44'/330'/0'/0/`,
  hasMemo: true,
};

const BitcoinValue = {
  symbol: BlockchainPlatform.BitcoinValue,
  networkSymbol: BlockchainPlatform.BitcoinValue,
  name: 'BitcoinValue',
  platform: BlockchainPlatform.BitcoinValue,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 0,
  hasMemo: false,
};

const Solana = {
  symbol: BlockchainPlatform.Solana,
  networkSymbol: BlockchainPlatform.Solana,
  name: 'Solana',
  platform: BlockchainPlatform.Solana,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 9,
  nativeScale: 0,
  hasMemo: false,
};

const nativeCurrencies: ICurrency[] = [
  Bitcoin,
  Ethereum,
  Polygon,
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
  Nem,
  Tron,
  Binance,
  BinanceCoin,
  Terra,
  Cosmos,
  BitcoinValue,
  Solana,
];

export class CurrencyRegistry {
  public static readonly Bitcoin: ICurrency = Bitcoin;
  public static readonly Ethereum: ICurrency = Ethereum;
  public static readonly Polygon: ICurrency = Polygon;
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
  public static readonly Nem: ICurrency = Nem;
  public static readonly Tron: ICurrency = Tron;
  public static readonly Binance: ICurrency = Binance;
  public static readonly BinanceCoin: ICurrency = BinanceCoin;
  public static readonly Terra: ICurrency = Terra;
  public static readonly Cosmos: ICurrency = Cosmos;
  public static readonly BitcoinValue: ICurrency = BitcoinValue;
  public static readonly Solana: ICurrency = Solana;
  /**
   * Register a currency on environment data
   * Native assets have been registered above
   * Most likely the tokens or other kind of programmatic assets will be added here
   *
   * @param c currency
   */
  public static registerCurrency(c: ICurrency): boolean {
    const symbol = c.symbol.toLowerCase();
    logger.info(`CurrencyRegistry::registerCurrency symbol=${symbol}`);
    if (allCurrencies.has(symbol)) {
      logger.warn(`Currency register multiple times: ${symbol}`);
      return false;
    }

    allCurrencies.set(symbol, c);
    onCurrencyRegisteredCallbacks.forEach(callback => callback(c));

    if (onSpecificCurrencyRegisteredCallbacks.has(symbol)) {
      onSpecificCurrencyRegisteredCallbacks.get(symbol).forEach(callback => callback());
    }

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
      isUTXOBased: false,
      propertyId,
      humanReadableScale: 0,
      nativeScale: scale,
      hasMemo: false,
    };

    allOmniAssets.push(currency);
    eventCallbacks['omni-registered'].forEach(callback => callback(currency));

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
      isUTXOBased: false,
      contractAddress,
      decimals,
      humanReadableScale: decimals,
      nativeScale: 0,
      hasMemo: false,
    };

    allErc20Tokens.push(currency);
    eventCallbacks['erc20-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static unregisterErc20Token(contractAddress: string) {
    logger.info(`unregister erc20: contract=${contractAddress}`);
    const symbol = [TokenType.ERC20, contractAddress].join('.');
    for (let i = 0; i < allErc20Tokens.length; i++) {
      const token = allErc20Tokens[i];
      if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
        allErc20Tokens.splice(i, 1);
        break;
      }
    }

    CurrencyRegistry.unregisterCurrency(symbol);
  }

  public static registerPolErc20Token(
    contractAddress: string,
    networkSymbol: string,
    name: string,
    decimals: number
  ): boolean {
    logger.info(
      `register polErc20: contract=${contractAddress}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`
    );
    const platform = BlockchainPlatform.Polygon;
    const symbol = [TokenType.POLERC20, contractAddress].join('.');
    const currency: IErc20Token = {
      symbol,
      networkSymbol,
      tokenType: TokenType.POLERC20,
      name,
      platform,
      isNative: false,
      isUTXOBased: false,
      contractAddress,
      decimals,
      humanReadableScale: decimals,
      nativeScale: 0,
      hasMemo: false,
    };

    allPolErc20Tokens.push(currency);
    eventCallbacks['polErc20-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static unregisterPolErc20Token(contractAddress: string) {
    logger.info(`unregister polErc20: contract=${contractAddress}`);
    const symbol = [TokenType.POLERC20, contractAddress].join('.');
    for (let i = 0; i < allPolErc20Tokens.length; i++) {
      const token = allErc20Tokens[i];
      if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
        allPolErc20Tokens.splice(i, 1);
        break;
      }
    }

    CurrencyRegistry.unregisterCurrency(symbol);
  }

  public static registerTrc20Token(
    contractAddress: string,
    networkSymbol: string,
    name: string,
    decimals: number
  ): boolean {
    logger.info(
      `register trc20: contract=${contractAddress}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`
    );
    const platform = BlockchainPlatform.Tomo;
    const symbol = [TokenType.ERC20Tomo, contractAddress].join('.');
    const currency: IErc20TokenTomo = {
      symbol,
      networkSymbol,
      tokenType: TokenType.ERC20Tomo,
      name,
      platform,
      isNative: false,
      isUTXOBased: false,
      contractAddress,
      decimals,
      humanReadableScale: decimals,
      nativeScale: 0,
      hasMemo: false,
    };

    allTrc20Tokens.push(currency);
    eventCallbacks['trc20-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static registerEosToken(code: string, networkSymbol: string, scale: number): boolean {
    const platform = BlockchainPlatform.EOS;
    const symbol = [TokenType.EOS, networkSymbol].join('.');
    const currency: IEosToken = {
      symbol,
      networkSymbol,
      tokenType: TokenType.EOS,
      name: networkSymbol,
      platform,
      isNative: false,
      isUTXOBased: false,
      code,
      humanReadableScale: 0,
      nativeScale: scale,
      hasMemo: true,
    };

    allEosTokens.push(currency);
    eventCallbacks['eos-token-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static registerBepToken(originSymbol: string, networkSymbol: string, scale: number): boolean {
    const platform = BlockchainPlatform.Binance;
    const symbol = [TokenType.BEP, networkSymbol].join('.');
    const currency: IBepToken = {
      symbol,
      networkSymbol,
      tokenType: TokenType.BEP,
      name: originSymbol,
      platform,
      isNative: false,
      isUTXOBased: false,
      humanReadableScale: scale,
      nativeScale: 0,
      originSymbol,
      hasMemo: true,
    };

    allBepTokens.push(currency);
    eventCallbacks['bep-token-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static registerBep20Token(
    contractAddress: string,
    networkSymbol: string,
    name: string,
    decimals: number
  ): boolean {
    logger.info(
      `register bep20: contract=${contractAddress}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`
    );
    const platform = BlockchainPlatform.BinanceSmartChain;
    const symbol = [TokenType.BEP20, contractAddress].join('.');
    const currency: IBep20Token = {
      symbol,
      networkSymbol,
      tokenType: TokenType.BEP20,
      name,
      platform,
      isNative: false,
      isUTXOBased: false,
      contractAddress,
      decimals,
      humanReadableScale: decimals,
      nativeScale: 0,
      hasMemo: false,
      family: BlockchainPlatform.Ethereum,
    };

    allBep20Tokens.push(currency);
    eventCallbacks['bep20-token-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static unregisterBep20Token(contractAddress: string) {
    logger.info(`unregister bep20: contract=${contractAddress}`);
    const symbol = [TokenType.BEP20, contractAddress].join('.');
    for (let i = 0; i < allBep20Tokens.length; i++) {
      const token = allBep20Tokens[i];
      if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
        allBep20Tokens.splice(i, 1);
        break;
      }
    }

    CurrencyRegistry.unregisterCurrency(symbol);
  }


  public static registerTerraToken(code: string, networkSymbol: string, scale: number): boolean {
    const platform = BlockchainPlatform.Terra;
    const symbol = [TokenType.TERRA, networkSymbol].join('.');
    const currency: ITerraToken = {
      symbol,
      networkSymbol,
      tokenType: TokenType.TERRA,
      name: code,
      platform,
      isNative: false,
      isUTXOBased: false,
      humanReadableScale: scale,
      type: TransactionBaseType.COSMOS,
      nativeScale: 0,
      code,
      hdPath: CurrencyRegistry.getOneCurrency(BlockchainPlatform.Terra).hdPath,
      hasMemo: true,
    };

    allTerraTokens.push(currency);
    eventCallbacks['terra-token-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static registerCosmosToken(code: string, networkSymbol: string, scale: number): boolean {
    const platform = BlockchainPlatform.Cosmos;
    const symbol = [TokenType.COSMOS, networkSymbol].join('.');
    const currency: ICosmosToken = {
      symbol,
      networkSymbol,
      tokenType: TokenType.COSMOS,
      name: code,
      platform,
      isNative: false,
      isUTXOBased: false,
      humanReadableScale: scale,
      type: TransactionBaseType.COSMOS,
      nativeScale: 0,
      code,
      hdPath: CurrencyRegistry.getOneCurrency(BlockchainPlatform.Cosmos).hdPath,
      hasMemo: true,
    };

    allCosmosTokens.push(currency);
    eventCallbacks['cosmos-token-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static registerTronTrc20Token(
    contractAddress: string,
    networkSymbol: string,
    name: string,
    decimals: number
  ): boolean {
    logger.info(
      `register tronTrc20: contract=${contractAddress}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`
    );
    const platform = BlockchainPlatform.Tron;
    const symbol = [TokenType.TRC20, contractAddress].join('.');
    const currency: ITrc20Token = {
      symbol,
      networkSymbol,
      tokenType: TokenType.TRC20,
      name,
      platform,
      isNative: false,
      isUTXOBased: false,
      contractAddress,
      decimals,
      humanReadableScale: decimals,
      nativeScale: 0,
      hasMemo: false,
    };

    allTronTrc20Tokens.push(currency);
    eventCallbacks['tronTrc20-registered'].forEach(callback => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static unregisterTronTrc20Token(contractAddress: string) {
    logger.info(`unregister tronTrc20: contract=${contractAddress}`);
    const symbol = [TokenType.TRC20, contractAddress].join('.');
    for (let i = 0; i < allTronTrc20Tokens.length; i++) {
      const token = allTronTrc20Tokens[i];
      if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
        allTronTrc20Tokens.splice(i, 1);
        break;
      }
    }

    CurrencyRegistry.unregisterCurrency(symbol);
  }

  public static registerSplToken(programId: string, networkSymbol: string, name: string, decimals: number): boolean {
    logger.info(`register spltoken: programId=${programId}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`);
    const platform = BlockchainPlatform.Solana;
    const symbol = [TokenType.SPLTOKEN, programId].join('.');
    const currency: ISplToken = {
      symbol,
      networkSymbol,
      tokenType: TokenType.SPLTOKEN,
      name,
      platform,
      isNative: false,
      isUTXOBased: false,
      programId,
      decimals,
      humanReadableScale: decimals,
      nativeScale: 0,
      hasMemo: false,
    };

    allSplToken.push(currency);
    eventCallbacks['spl-token-registered'].forEach((callback) => callback(currency));

    return CurrencyRegistry.registerCurrency(currency);
  }

  public static unregisterSplToken(programId: string) {
    logger.info(`unregister Spltoken: programId=${programId}`);
    const symbol = [TokenType.SPLTOKEN, programId].join('.');
    for (let i = 0; i < allSplToken.length; i++) {
      const token = allSplToken[i];
      if (token.programId.toLowerCase() === programId.toLowerCase()) {
        allSplToken.splice(i, 1);
        break;
      }
    }

    CurrencyRegistry.unregisterCurrency(symbol);
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

  public static getOnePolErc20Token(contractAddress: string): IErc20Token {
    const symbol = [TokenType.ERC20, contractAddress].join('.');
    return CurrencyRegistry.getOneCurrency(symbol) as IErc20Token;
  }

  public static getAllBepTokens(): IBepToken[] {
    return allBepTokens;
  }

  public static getAllBep20Tokens(): IBep20Token[] {
    return allBep20Tokens;
  }

  public static getOneBep20Token(contractAddress: string): IBep20Token {
    const symbol = [TokenType.BEP20, contractAddress].join('.');
    return CurrencyRegistry.getOneCurrency(symbol) as IBep20Token;
  }

  public static getAllErc20Tokens(): IErc20Token[] {
    return allErc20Tokens;
  }

  public static getAllPolErc20Tokens(): IErc20Token[] {
    return allPolErc20Tokens;
  }

  public static getAllTrc20Tokens(): IErc20Token[] {
    return allTrc20Tokens;
  }

  public static getOneEosToken(contractAddress: string): IEosToken {
    const symbol = [TokenType.EOS, contractAddress].join('.');
    return CurrencyRegistry.getOneCurrency(symbol) as IEosToken;
  }

  public static getAllEosTokens(): IEosToken[] {
    return allEosTokens;
  }

  /**
   * Just return all currencies that were registered
   */
  public static getAllCurrencies(): ICurrency[] {
    return Array.from(allCurrencies.values());
  }

  public static hasOneCurrency(symbol: string): boolean {
    return allCurrencies.has(symbol);
  }

  public static hasOneNativeCurrency(symbol: string): boolean {
    return nativeCurrencies.map(c => c.symbol).indexOf(symbol) > -1;
  }

  public static getAllTerraTokens(): ITerraToken[] {
    return allTerraTokens;
  }

  public static getAllCosmosTokens(): ICosmosToken[] {
    return allCosmosTokens;
  }

  public static getOneTronTrc20Token(contractAddress: string): ITrc20Token {
    const symbol = [TokenType.TRC20, contractAddress].join('.');
    return CurrencyRegistry.getOneCurrency(symbol) as ITrc20Token;
  }

  public static getAllTronTrc20Tokens(): ITrc20Token[] {
    return allTronTrc20Tokens;
  }

  public static getAllSplTokens(): ISplToken[] {
    return allSplToken;
  }

  /**
   * Get information of one currency by its symbol
   *
   * @param symbol
   */
  public static getOneCurrency(symbol: string): ICurrency {
    symbol = symbol.toLowerCase();
    if (!allCurrencies.has(symbol)) {
      throw new Error(`CurrencyRegistry::getOneCurrency cannot find currency has symbol: ${symbol}`);
    }

    return allCurrencies.get(symbol);
  }

  public static getOneNativeCurrency(platform: BlockchainPlatform): ICurrency {
    const symbol = (platform as string).toLowerCase();
    if (!allCurrencies.has(symbol)) {
      throw new Error(`CurrencyRegistry::getOneNativeCurrency cannot find currency has symbol: ${symbol}`);
    }

    return allCurrencies.get(symbol);
  }

  public static getCurrenciesOfPlatform(platform: BlockchainPlatform): ICurrency[] {
    const result: ICurrency[] = [];
    switch (platform) {
      case BlockchainPlatform.Bitcoin:
        result.push(Bitcoin);
        result.push(...CurrencyRegistry.getAllOmniAssets());
        break;

      case BlockchainPlatform.Ethereum:
        result.push(Ethereum);
        result.push(...CurrencyRegistry.getAllErc20Tokens());
        break;

      case BlockchainPlatform.Polygon:
        result.push(Polygon);
        result.push(...CurrencyRegistry.getAllPolErc20Tokens());
        break;
      case BlockchainPlatform.Tomo:
        result.push(Tomo);
        result.push(...CurrencyRegistry.getAllTrc20Tokens());
        break;

      case BlockchainPlatform.EOS:
        result.push(...CurrencyRegistry.getAllEosTokens());
        break;

      case BlockchainPlatform.BitcoinCash:
        result.push(CurrencyRegistry.BitcoinCash);
        break;

      case BlockchainPlatform.Litecoin:
        result.push(CurrencyRegistry.Litecoin);
        break;

      case BlockchainPlatform.Dash:
        result.push(CurrencyRegistry.Dash);
        break;

      case BlockchainPlatform.EthereumClassic:
        result.push(CurrencyRegistry.EthereumClasssic);
        break;

      case BlockchainPlatform.Tomo:
        result.push(CurrencyRegistry.Tomo);
        break;

      case BlockchainPlatform.Cardano:
        result.push(CurrencyRegistry.Cardano);
        break;

      case BlockchainPlatform.Ripple:
        result.push(CurrencyRegistry.Ripple);
        break;

      case BlockchainPlatform.Stellar:
        result.push(CurrencyRegistry.Stellar);
        break;

      case BlockchainPlatform.Nem:
        result.push(CurrencyRegistry.Nem);
        break;

      case BlockchainPlatform.Binance:
        result.push(...CurrencyRegistry.getAllBepTokens());
        break;

      case BlockchainPlatform.BinanceSmartChain:
        result.push(CurrencyRegistry.BinanceCoin);
        result.push(...CurrencyRegistry.getAllBep20Tokens());
        break;

      case BlockchainPlatform.Terra:
        result.push(...CurrencyRegistry.getAllTerraTokens());
        break;

      case BlockchainPlatform.NEO:
        result.push(CurrencyRegistry.NEO);
        break;

      case BlockchainPlatform.Cosmos:
        result.push(...CurrencyRegistry.getAllCosmosTokens());
        break;

      case BlockchainPlatform.BitcoinValue:
        result.push(CurrencyRegistry.BitcoinValue);
        break;

      case BlockchainPlatform.Tron:
        result.push(Tron);
        result.push(...CurrencyRegistry.getAllTronTrc20Tokens());
        break;
      case BlockchainPlatform.Solana:
        result.push(Solana);
        result.push(...CurrencyRegistry.getAllSplTokens());
        break;

      default:
        throw new Error(`CurrencyRegistry::getCurrenciesOfPlatform hasn't been implemented for ${platform} yet.`);
    }

    return result;
  }

  /**
   * Update config for a currency
   *
   * @param c
   * @param config
   */
  public static setCurrencyConfig(c: ICurrency, config: ICurrencyConfig) {
    const symbol = c.symbol.toLowerCase();
    let finalConfig: ICurrencyConfig;

    // Keep configs that is already set on the environment
    if (allCurrencyConfigs.has(symbol)) {
      const oldConfig = allCurrencyConfigs.get(symbol);
      finalConfig = Object.assign({}, finalConfig, oldConfig);
    }

    // And merge it with desired config
    finalConfig = Object.assign({}, finalConfig, config);

    logger.info(`CurrencyRegistry::setCurrencyConfig: symbol=${symbol} endpoint=${finalConfig.internalEndpoint}`);

    // Put it to the environment again
    allCurrencyConfigs.set(symbol, finalConfig);
    onCurrencyConfigSetCallbacks.forEach(callback => callback(c, config));
  }

  /**
   * Get config of a single currency
   * @param c
   */
  public static getCurrencyConfig(c: ICurrency): ICurrencyConfig {
    const symbol = c.symbol.toLowerCase();
    let config = allCurrencyConfigs.get(symbol);

    // If config for particular currency is not available, try the platform's one
    if (!config) {
      config = allCurrencyConfigs.get(c.platform);
    }

    // Something went wrong if the config still could not be found
    if (!config) {
      throw new Error(`CurrencyRegistry::getCurrencyConfig cannot find currency has symbol: ${symbol}`);
    }

    return config;
  }

  /**
   * Add listener that is triggerred when a new currency is registered
   *
   * @param callback
   */
  public static onCurrencyRegistered(callback: (currency: ICurrency) => void) {
    onCurrencyRegisteredCallbacks.push(callback);
  }

  /**
   * Add listener that is triggerred when a new currency is registered
   *
   * @param callback
   */
  public static onSpecificCurrencyRegistered(currency: ICurrency, callback: () => void) {
    const symbol = currency.symbol.toLowerCase();

    // If currency has been registered before, just invoke the callback
    if (allCurrencies.has(symbol)) {
      callback();
      return;
    }

    if (!onSpecificCurrencyRegisteredCallbacks.has(symbol)) {
      onSpecificCurrencyRegisteredCallbacks.set(symbol, []);
    }

    onSpecificCurrencyRegisteredCallbacks.get(symbol).push(callback);
  }

  /**
   * Add listener that is triggerred when an ERC20 token is registered
   *
   * @param callback
   */
  public static onERC20TokenRegistered(callback: (token: IErc20Token) => void) {
    if (allErc20Tokens.length > 0) {
      allErc20Tokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['erc20-registered'].push(callback);
  }

    /**
   * Add listener that is triggerred when an PolERC20 token is registered
   *
   * @param callback
   */
     public static onPolERC20TokenRegistered(callback: (token: IErc20Token) => void) {
      if (allPolErc20Tokens.length > 0) {
        allPolErc20Tokens.forEach(token => {
          callback(token);
        });
      }
  
      eventCallbacks['polErc20-registered'].push(callback);
    }

  /**
   * Add listener that is triggerred when an TRC20 token is registered
   *
   * @param callback
   */
  public static onTRC20TokenRegistered(callback: (token: IErc20TokenTomo) => void) {
    if (allTrc20Tokens.length > 0) {
      allTrc20Tokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['trc20-registered'].push(callback);
  }

  /**
   * Add listener that is triggerred when an Omni Asset is registered
   *
   * @param callback
   */
  public static onOmniAssetRegistered(callback: (asset: IOmniAsset) => void) {
    if (allOmniAssets.length > 0) {
      allOmniAssets.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['omni-registered'].push(callback);
  }

  /**
   * Add listener that is triggerred when an EOS token is registered
   *
   * @param callback
   */
  public static onEOSTokenRegistered(callback: (token: IEosToken) => void) {
    if (allEosTokens.length > 0) {
      allEosTokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['eos-token-registered'].push(callback);
  }

  public static onBepTokenRegistered(callback: (token: IBepToken) => void) {
    if (allBepTokens.length) {
      allBepTokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['bep-token-registered'].push(callback);
  }

  public static onBep20TokenRegistered(callback: (token: IBep20Token) => void) {
    if (allBep20Tokens.length) {
      allBep20Tokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['bep20-token-registered'].push(callback);
  }

  public static onTerraTokenRegistered(callback: (token: ITerraToken) => void) {
    if (allTerraTokens.length) {
      allTerraTokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['terra-token-registered'].push(callback);
  }

  public static onCosmosTokenRegistered(callback: (token: ICosmosToken) => void) {
    if (allCosmosTokens.length) {
      allCosmosTokens.forEach(token => {
        callback(token);
      });
    }

    eventCallbacks['cosmos-token-registered'].push(callback);
  }

    /**
   * Add listener that is triggerred when an TRC20 token (Tron blockchain) is registered
   *
   * @param callback
   */
     public static onTronTrc20TokenRegistered(callback: (token: ITrc20Token) => void) {
      if (allTronTrc20Tokens.length > 0) {
        allTronTrc20Tokens.forEach(token => {
          callback(token);
        });
      }
  
      eventCallbacks['tronTrc20-registered'].push(callback);
    }

  /**
   * Add listener that is triggerred when an Spl token (Solana blockchain) is registered
   *
   * @param callback
   */
  public static onSplTokenRegistered(callback: (token: ISplToken) => void) {
    if (allSplToken.length > 0) {
      allSplToken.forEach((token) => {
        callback(token);
      });
    }

    eventCallbacks['spl-token-registered'].push(callback);
  }

  /**
   * Add listener that is triggerred when a currency config is setup
   *
   * @param callback
   */
  public static onCurrencyConfigSet(callback: (currency: ICurrency, config: ICurrencyConfig) => void) {
    onCurrencyConfigSetCallbacks.push(callback);
  }

  protected static unregisterCurrency(symbol: string): boolean {
    if (!allCurrencies.has(symbol)) {
      logger.error(`Try to unregister an invalid currency symbol=${symbol}`);
      return false;
    }

    return allCurrencies.delete(symbol);
  }
}

process.nextTick(() => {
  // Add native currencies to the list first
  nativeCurrencies.forEach(c => CurrencyRegistry.registerCurrency(c));
});

export default CurrencyRegistry;
