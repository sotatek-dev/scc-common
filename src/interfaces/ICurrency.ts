import { Address } from '../types';
import BlockchainPlatform from '../enums/BlockchainPlatform';
import { TokenType } from '../enums';

export interface ICurrency {
  // Currency symbol. It can be primary assets of a platform like btc, eth
  // Or a kind of utility token/asset on that platform
  readonly symbol: string;

  // Symbol on its own network. This property maybe not unique
  readonly networkSymbol: string;

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
