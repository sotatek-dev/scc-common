import { Address } from '../types';
import BlockchainPlatform from '../enums/BlockchainPlatform';
import { TokenType } from '../enums';
export interface ICurrency {
    readonly symbol: string;
    readonly networkSymbol: string;
    readonly name: string;
    readonly platform: BlockchainPlatform;
    readonly isUTXOBased: boolean;
    readonly isNative: boolean;
    readonly humanReadableScale: number;
    readonly nativeScale: number;
    readonly hasMemo: boolean;
}
export default ICurrency;
export interface IToken extends ICurrency {
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
    readonly code: string;
    readonly networkSymbol: string;
}
export interface IBepToken extends IToken {
    readonly originSymbol: string;
}
