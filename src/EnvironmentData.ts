// Make sure the EnvironmentData is singleton in whole process
if (process.env.isEnvSet_KnV5Ha0UlAAEME69I6KA === '1') {
  throw new Error(`Something went wrong. EnvironmentData is declared multiple times.`);
}
process.env.isEnvSet_KnV5Ha0UlAAEME69I6KA = '1';

import { getLogger } from './Logger';
import { ICurrency, nativeCurrencies } from './interfaces/ICurrency';
import { BlockchainPlatform, NetworkType, TokenType } from './enums';
import { ICurrencyConfig, IOmniAsset, IErc20Token, IGlobalEnvConfig } from './interfaces';
import BaseGateway from './BaseGateway';
/**
 * Environment data is usually loaded from database at runtime
 * These are some pre-defined types of data
 * Is there any case we need to defined it as generic?
 */
const logger = getLogger('EnvironmentData');
const allCurrencies = new Map<string, ICurrency>();
const allCurrencyConfigs = new Map<string, ICurrencyConfig>();
const allCurrencyGateways = new Map<string, BaseGateway>();
const allErc20Tokens: IErc20Token[] = [];
const allOmniAssets: IOmniAsset[] = [];
const envConfig = new Map<string, string>();

let _globalEnvConfig: IGlobalEnvConfig = null;
let _appId: string = 'PP70ExC8Hr';

// Add native currencies to the list first
nativeCurrencies.forEach(c => registerCurrency(c));

/**
 * Register a currency on environment data
 * Native assets have been registered above
 * Most likely the tokens or other kind of programmatic assets will be added here
 *
 * @param c currency
 */
function registerCurrency(c: ICurrency): boolean {
  if (allCurrencies.has(c.symbol)) {
    logger.warn(`Currency register multiple times: ${c.symbol}`);
    return false;
  }

  allCurrencies.set(c.symbol, c);
  return true;
}

export function registerOmniAsset(propertyId: number, networkSymbol: string, name: string, scale: number): boolean {
  logger.info(`register Omni: propertyId=${propertyId}, networkSymbol=${networkSymbol}, name=${name}, scale=${scale}`);
  const platform = BlockchainPlatform.Bitcoin;
  const symbol = [platform, propertyId].join('|');
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

  return registerCurrency(currency);
}

export function findOmniAsset(propertyId: number): IOmniAsset {
  const platform = BlockchainPlatform.Bitcoin;
  const symbol = [platform, propertyId].join('|');
  return findOneCurrency(symbol) as IOmniAsset;
}

export function getAllOmniAssets(): IOmniAsset[] {
  return allOmniAssets;
}

export function registerErc20Token(
  contractAddress: string,
  networkSymbol: string,
  name: string,
  decimals: number
): boolean {
  logger.info(
    `register erc20: contract=${contractAddress}, networkSymbol=${networkSymbol}, name=${name}, decimals=${decimals}`
  );
  const platform = BlockchainPlatform.Ethereum;
  const symbol = [platform, contractAddress].join('|');
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

  return registerCurrency(currency);
}

export function findErc20Token(contractAddress: string): IErc20Token {
  const platform = BlockchainPlatform.Ethereum;
  const symbol = [platform, contractAddress].join('|');
  return findOneCurrency(symbol) as IErc20Token;
}

export function getAllErc20Tokens(): IErc20Token[] {
  return allErc20Tokens;
}

/**
 * Just return all currencies that were registered
 */
export function getAllCurrencies(): ICurrency[] {
  return Array.from(allCurrencies.values());
}

/**
 * Get information of one currency by its symbol
 *
 * @param symbol
 */
export function findOneCurrency(symbol: string): ICurrency {
  if (!allCurrencies.has(symbol)) {
    logger.error(`CCEnv::findOneCurrency cannot find currency has symbol: ${symbol}`);
    return null;
  }

  return allCurrencies.get(symbol);
}

export function getOneNativeCurrency(symbol: BlockchainPlatform): ICurrency {
  if (!allCurrencies.has(symbol)) {
    logger.error(`CCEnv::findOneCurrency cannot find currency has symbol: ${symbol}`);
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
export function setCurrencyConfig(c: ICurrency, config: ICurrencyConfig) {
  const symbol = c.symbol;
  let finalConfig: ICurrencyConfig;

  // Keep configs that is already set on the environment
  if (allCurrencyConfigs.has(symbol)) {
    const oldConfig = allCurrencyConfigs.get(symbol);
    finalConfig = Object.assign(finalConfig, oldConfig);
  }

  // And merge it with desired config
  finalConfig = Object.assign(finalConfig, config);

  // Put it to the environment again
  allCurrencyConfigs.set(symbol, finalConfig);
}

/**
 * Get config of a single currency
 * @param c
 */
export function getCurrencyConfig(c: ICurrency): ICurrencyConfig {
  const symbol = c.symbol;
  if (!allCurrencies.has(symbol)) {
    logger.error(`CCEnv::getOneCurrencyConfig cannot find currency has symbol: ${symbol}`);
    return null;
  }

  return allCurrencyConfigs.get(symbol);
}

export function getCustomEnvConfig(key: string): string {
  return envConfig.get(key);
}

export function setCustomEnvConfig(key: string, value: string) {
  switch (key) {
    case 'NETWORK':
      if (!(value in NetworkType)) {
        throw new Error(`Trying to set invalid value for network: ${value}`);
      }
      _globalEnvConfig = Object.assign(_globalEnvConfig, { network: value });
      break;

    default:
      break;
  }

  return envConfig.set(key, value);
}

export function getGlobalEnvConfig(): IGlobalEnvConfig {
  return _globalEnvConfig;
}

export function getAppId(): string {
  return _appId;
}

export function setAppId(appId: string) {
  return (_appId = appId);
}

export function getNetwork(): NetworkType {
  return _globalEnvConfig.network;
}

// Check whether the environment is mainnet
export function isMainnet(): boolean {
  return getNetwork() === NetworkType.MainNet;
}

// Check whether the environment is public testnet
export function isTestnet(): boolean {
  return getNetwork() === NetworkType.TestNet;
}

// Check whether the environment is private net
export function isPrivnet(): boolean {
  return getNetwork() === NetworkType.PrivateNet;
}

export function registerCurrencyGateway(currency: ICurrency, gatewayInstance: BaseGateway) {
  if (allCurrencyGateways.has(currency.symbol)) {
    logger.warn(`Register currency gateway multiple times: ${currency.symbol}`);
  }

  allCurrencyGateways.set(currency.symbol, gatewayInstance);
}

export function getCurrencyGateway(currency: ICurrency): BaseGateway {
  if (allCurrencyGateways.has(currency.symbol)) {
    throw new Error(`Could not get gateway instance for currency: ${currency.symbol}`);
  }

  return allCurrencyGateways.get(currency.symbol);
}
