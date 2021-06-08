import { Address } from '../types';
import BlockchainPlatform from '../enums/BlockchainPlatform';
import { TokenType, TransactionBaseType } from '../enums';
export interface ICurrency {
    readonly symbol: string;
    readonly networkSymbol: string;
    readonly name: string;
    readonly platform: BlockchainPlatform;
    readonly isUTXOBased: boolean;
    readonly type?: TransactionBaseType;
    readonly isNative: boolean;
    readonly humanReadableScale: number;
    readonly nativeScale: number;
    readonly hdPath?: string;
    readonly hasMemo: boolean;
    readonly family?: BlockchainPlatform;
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
export interface IBep20Token extends IToken {
    readonly contractAddress: Address;
    readonly decimals: number;
}
export interface ITerraToken extends IToken {
    readonly code: string;
}
export interface ICosmosToken extends IToken {
    readonly code: string;
}
export interface ITrc20Token extends IToken {
    readonly contractAddress: Address;
    readonly decimals: number;
}
