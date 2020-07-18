import { ICurrency, IEosToken, IErc20TokenTomo, IBepToken, ITerraToken } from '../interfaces/ICurrency';
import { ICurrencyConfig, IOmniAsset, IErc20Token } from '../interfaces';
import { BlockchainPlatform } from '../enums';
export declare class CurrencyRegistry {
    static readonly Bitcoin: ICurrency;
    static readonly Ethereum: ICurrency;
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
    static readonly Terra: ICurrency;
    static registerCurrency(c: ICurrency): boolean;
    static registerOmniAsset(propertyId: number, networkSymbol: string, name: string, scale: number): boolean;
    static registerErc20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static unregisterErc20Token(contractAddress: string): void;
    static registerTrc20Token(contractAddress: string, networkSymbol: string, name: string, decimals: number): boolean;
    static registerEosToken(code: string, networkSymbol: string, scale: number): boolean;
    static registerBepToken(originSymbol: string, networkSymbol: string, scale: number): boolean;
    static registerTerraToken(code: string, networkSymbol: string, scale: number): boolean;
    static getOneOmniAsset(propertyId: number): IOmniAsset;
    static getAllOmniAssets(): IOmniAsset[];
    static getOneErc20Token(contractAddress: string): IErc20Token;
    static getAllBepTokens(): IBepToken[];
    static getAllErc20Tokens(): IErc20Token[];
    static getAllTrc20Tokens(): IErc20Token[];
    static getOneEosToken(contractAddress: string): IEosToken;
    static getAllEosTokens(): IEosToken[];
    static getAllCurrencies(): ICurrency[];
    static hasOneCurrency(symbol: string): boolean;
    static hasOneNativeCurrency(symbol: string): boolean;
    static getAllTerraTokens(): ITerraToken[];
    static getOneCurrency(symbol: string): ICurrency;
    static getOneNativeCurrency(platform: BlockchainPlatform): ICurrency;
    static getCurrenciesOfPlatform(platform: BlockchainPlatform): ICurrency[];
    static setCurrencyConfig(c: ICurrency, config: ICurrencyConfig): void;
    static getCurrencyConfig(c: ICurrency): ICurrencyConfig;
    static onCurrencyRegistered(callback: (currency: ICurrency) => void): void;
    static onSpecificCurrencyRegistered(currency: ICurrency, callback: () => void): void;
    static onERC20TokenRegistered(callback: (token: IErc20Token) => void): void;
    static onTRC20TokenRegistered(callback: (token: IErc20TokenTomo) => void): void;
    static onOmniAssetRegistered(callback: (asset: IOmniAsset) => void): void;
    static onEOSTokenRegistered(callback: (token: IEosToken) => void): void;
    static onBepTokenRegistered(callback: (token: IBepToken) => void): void;
    static onTerraTokenRegistered(callback: (token: ITerraToken) => void): void;
    static onCurrencyConfigSet(callback: (currency: ICurrency, config: ICurrencyConfig) => void): void;
    protected static unregisterCurrency(symbol: string): boolean;
}
export default CurrencyRegistry;
