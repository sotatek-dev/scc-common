import {BlockchainPlatform, TransactionBaseType} from "../enums";

/**
 * Built-in currencies
 */

export const Bitcoin = {
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

export const Ethereum = {
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
export const Cardano = {
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

export const BitcoinCash = {
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

export const BitcoinSV = {
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

export const EOS = {
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

export const Litecoin = {
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

export const Dash = {
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

export const EthereumClasssic = {
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

export const NEO = {
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

export const NEOGAS = {
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

export const Tomo = {
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

export const Ripple = {
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

export const Stellar = {
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

export const Nem = {
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

export const Tron = {
  symbol: BlockchainPlatform.Tron,
  networkSymbol: BlockchainPlatform.Tron,
  name: 'Tron',
  platform: BlockchainPlatform.Tron,
  isNative: true,
  isUTXOBased: true,
  humanReadableScale: 8,
  nativeScale: 6,
  hasMemo: false,
};

export const Binance = {
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

export const Terra = {
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

export const Cosmos = {
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

// const ONT_BIP44_PATH = "m/44'/1024'/0'/0/0";
export const ONT = {
  symbol: 'ont',
  networkSymbol: 'ont',
  name: 'ONT',
  platform: BlockchainPlatform.ONG,
  isNative: false,
  isUTXOBased: false,
  humanReadableScale: 8,
  type: TransactionBaseType.ONT,
  nativeScale: 0,
  // hdPath: ONT_BIP44_PATH,
  hasMemo: false,
};

export const ONG = {
  symbol: BlockchainPlatform.ONG,
  networkSymbol: BlockchainPlatform.ONG,
  name: 'ONG',
  platform: BlockchainPlatform.ONG,
  isNative: true,
  isUTXOBased: false,
  humanReadableScale: 8,
  type: TransactionBaseType.ONT,
  nativeScale: 0,
  hasMemo: false,
};