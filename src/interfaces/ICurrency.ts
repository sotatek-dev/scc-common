import { Address } from '../types';
import BlockchainPlatform from '../enums/BlockchainPlatform';
import { TokenType } from '../enums';

export interface ICurrency {
  // Currency symbol. It can be primary assets of a platform like btc, eth
  // Or a kind of utility token/asset on that platform
  readonly symbol: string;

  // Full name of the currency
  readonly name: string;

  // The blockchain platform that currency is based on
  // Maybe there're various currencies on a same platform
  readonly platform: BlockchainPlatform;

  // Currency is native asset
  readonly isNative: boolean;

  // Maxium number of digit that is handle natively
  readonly scale: number;
}

export default ICurrency;

interface IToken extends ICurrency {
  readonly networkSymbol: string;
  readonly tokenType: TokenType;
}

export interface IErc20Token extends IToken {
  readonly contractAddress: Address;
  readonly decimals: number;
}

export interface IErc20TokenTomo extends IToken {
  readonly contractAddress: Address;
  readonly decimals: number;
}

export interface INep5Token extends IToken {
  readonly contractAddress: Address;
  readonly decimals: number;
}

export interface IOmniAsset extends IToken {
  readonly propertyId: number;
}

export interface IEosToken extends IToken {
  readonly networkSymbol: string;
}

/**
 * Built-in currencies
 */
const nativeCurrencies: ICurrency[] = [
  {
    symbol: BlockchainPlatform.Bitcoin,
    name: 'Bitcoin',
    platform: BlockchainPlatform.Bitcoin,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.Ethereum,
    name: 'Ethereum',
    platform: BlockchainPlatform.Ethereum,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.Cardano,
    name: 'Cardano',
    platform: BlockchainPlatform.Cardano,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.BitcoinCash,
    name: 'BitcoinCash',
    platform: BlockchainPlatform.BitcoinCash,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.BitcoinSV,
    name: 'BitcoinSV',
    platform: BlockchainPlatform.BitcoinSV,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.EOS,
    name: 'EOS',
    platform: BlockchainPlatform.EOS,
    isNative: true,
    scale: 4,
  },
  {
    symbol: BlockchainPlatform.Litecoin,
    name: 'Litecoin',
    platform: BlockchainPlatform.Litecoin,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.Dash,
    name: 'Dash',
    platform: BlockchainPlatform.Dash,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.EthereumClassic,
    name: 'EthereumClassic',
    platform: BlockchainPlatform.EthereumClassic,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.NEO,
    name: 'NEO',
    platform: BlockchainPlatform.NEO,
    isNative: true,
    scale: 0,
  },
  {
    symbol: 'gas',
    name: 'GAS',
    platform: BlockchainPlatform.NEO,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.Tomo,
    name: 'Tomo',
    platform: BlockchainPlatform.Tomo,
    isNative: true,
    scale: 0,
  },
  {
    symbol: BlockchainPlatform.Ripple,
    name: 'Ripple',
    platform: BlockchainPlatform.Ripple,
    isNative: true,
    scale: 6,
  },
  {
    symbol: BlockchainPlatform.Stellar,
    name: 'Stellar',
    platform: BlockchainPlatform.Stellar,
    isNative: true,
    scale: 6,
  },
];

export { nativeCurrencies };
