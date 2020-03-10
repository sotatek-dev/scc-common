export interface ICurrencyConfig {
    readonly currency: string;
    readonly network: string;
    readonly chainId: string;
    readonly chainName: string;
    readonly averageBlockTime: number;
    readonly requiredConfirmations: number;
    readonly restEndpoint: string;
    readonly rpcEndpoint: string;
    readonly explorerEndpoint: string;
    readonly internalEndpoint: string;
}
