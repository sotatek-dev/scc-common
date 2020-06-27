import { NetworkType } from '../enums';
import { IGlobalEnvConfig } from '../interfaces';
export declare class EnvConfigRegistry {
    static getCustomEnvConfig(key: string): string;
    static setCustomEnvConfig(key: string, value: string): Map<string, string>;
    static getGlobalEnvConfig(): IGlobalEnvConfig;
    static getAppId(): string;
    static setAppId(appId: string): void;
    static getNetwork(): NetworkType;
    static isMainnet(): boolean;
    static isTestnet(): boolean;
    static isPrivnet(): boolean;
    static onNetworkChanged(func: (network: NetworkType) => void): void;
    static isUsingRedis(): boolean;
}
export default EnvConfigRegistry;
