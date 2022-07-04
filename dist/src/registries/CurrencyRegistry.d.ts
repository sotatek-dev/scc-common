import { ICurrency, IEosToken, IErc20TokenTomo, IBepToken, ITerraToken, ICosmosToken, IBep20Token, ITrc20Token } from '../interfaces/ICurrency';
import { ICurrencyConfig, IOmniAsset, IErc20Token } from '../interfaces';
import { BlockchainPlatform } from '../enums';
export declare class CurrencyRegistry {
    static readonly Bitcoin: ICurrency;
    static readonly Ethereum: ICurrency;
    static readonly Polygon: ICurrency;
    static readonly Cardano: ICurrency;
    static readonly BitcoinCash: ICurrency;
    static readonly BitcoinSV: ICurrency;
    static readonly EOS: ICurrency;
    static readonly Litecoin: ICurrency;
    static readonly Dash: ICurrency;
    static readonly EthereumClasssic: ICurrency;
    static readonly NEO: ICurrency;
    static readonly NEOGAS: ICurrency;
    static readonly Tomo: ICurrency;
    static readonly Ripple: ICurrency;
    static readonly Stellar: ICurrency;
    static readonly Nem: ICurrency;
    static readonly Tron: ICurrency;
    static readonly Binance: ICurrency;
    static readonly BinanceCoin: ICurrency;
    static readonly Terra: ICurrency;
    static readonly Cosmos: ICurrency;
    static readonly BitcoinValue: ICurrency;
    static registerCurrency(c: ICurrency): boolean;
    static registerOmniAsset(propertyId: number, networkSymbol: string, name: string, scale: number): boolean;
    static registerErc20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static unregisterErc20Token(contractAddress: string): void;
    static registerPolErc20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static unregisterPolErc20Token(contractAddress: string): void;
    static registerTrc20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static registerEosToken(code: string, networkSymbol: string, scale: number): boolean;
    static registerBepToken(originSymbol: string, networkSymbol: string, scale: number): boolean;
    static registerBep20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static unregisterBep20Token(contractAddress: string): void;
    static registerTerraToken(code: string, networkSymbol: string, scale: number): boolean;
    static registerCosmosToken(code: string, networkSymbol: string, scale: number): boolean;
    static registerTronTrc20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static unregisterTronTrc20Token(contractAddress: string): void;
    static getOneOmniAsset(propertyId: number): IOmniAsset;
    static getAllOmniAssets(): IOmniAsset[];
    static getOneErc20Token(contractAddress: string): IErc20Token;
    static getOnePolErc20Token(contractAddress: string): IErc20Token;
    static getAllBepTokens(): IBepToken[];
    static getAllBep20Tokens(): IBep20Token[];
    static getOneBep20Token(contractAddress: string): IBep20Token;
    static getAllErc20Tokens(): IErc20Token[];
    static getAllPolErc20Tokens(): IErc20Token[];
    static getAllTrc20Tokens(): IErc20Token[];
    static getOneEosToken(contractAddress: string): IEosToken;
    static getAllEosTokens(): IEosToken[];
    static getAllCurrencies(): ICurrency[];
    static hasOneCurrency(symbol: string): boolean;
    static hasOneNativeCurrency(symbol: string): boolean;
    static getAllTerraTokens(): ITerraToken[];
    static getAllCosmosTokens(): ICosmosToken[];
    static getOneTronTrc20Token(contractAddress: string): ITrc20Token;
    static getAllTronTrc20Tokens(): ITrc20Token[];
    static getOneCurrency(symbol: string): ICurrency;
    static getOneNativeCurrency(platform: BlockchainPlatform): ICurrency;
    static getCurrenciesOfPlatform(platform: BlockchainPlatform): ICurrency[];
    static setCurrencyConfig(c: ICurrency, config: ICurrencyConfig): void;
    static getCurrencyConfig(c: ICurrency): ICurrencyConfig;
    static onCurrencyRegistered(callback: (currency: ICurrency) => void): void;
    static onSpecificCurrencyRegistered(currency: ICurrency, callback: () => void): void;
    static onERC20TokenRegistered(callback: (token: IErc20Token) => void): void;
    static onPolERC20TokenRegistered(callback: (token: IErc20Token) => void): void;
    static onTRC20TokenRegistered(callback: (token: IErc20TokenTomo) => void): void;
    static onOmniAssetRegistered(callback: (asset: IOmniAsset) => void): void;
    static onEOSTokenRegistered(callback: (token: IEosToken) => void): void;
    static onBepTokenRegistered(callback: (token: IBepToken) => void): void;
    static onBep20TokenRegistered(callback: (token: IBep20Token) => void): void;
    static onTerraTokenRegistered(callback: (token: ITerraToken) => void): void;
    static onCosmosTokenRegistered(callback: (token: ICosmosToken) => void): void;
    static onTronTrc20TokenRegistered(callback: (token: ITrc20Token) => void): void;
    static onCurrencyConfigSet(callback: (currency: ICurrency, config: ICurrencyConfig) => void): void;
    protected static unregisterCurrency(symbol: string): boolean;
}
export default CurrencyRegistry;
