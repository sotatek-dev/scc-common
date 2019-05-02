import { getLogger } from '../Logger';
import { NetworkType } from '../enums';
import { IGlobalEnvConfig } from '../interfaces';
const logger = getLogger('EnvConfigRegistry');

const envConfig = new Map<string, string>();
let _appId: string = 'PP70ExC8Hr';
let _globalEnvConfig: IGlobalEnvConfig = {
  network: NetworkType.TestNet,
};

export class EnvConfigRegistry {
  public static getCustomEnvConfig(key: string): string {
    return envConfig.get(key);
  }

  public static setCustomEnvConfig(key: string, value: string) {
    logger.info(`setCustomEnvConfig key=${key}, value=${value}`);
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

  public static getGlobalEnvConfig(): IGlobalEnvConfig {
    return _globalEnvConfig;
  }

  public static getAppId(): string {
    return _appId;
  }

  public static setAppId(appId: string) {
    _appId = appId;
  }

  public static getNetwork(): NetworkType {
    return _globalEnvConfig.network;
  }

  // Check whether the environment is mainnet
  public static isMainnet(): boolean {
    return EnvConfigRegistry.getNetwork() === NetworkType.MainNet;
  }

  // Check whether the environment is public testnet
  public static isTestnet(): boolean {
    return EnvConfigRegistry.getNetwork() === NetworkType.TestNet;
  }

  // Check whether the environment is private net
  public static isPrivnet(): boolean {
    return EnvConfigRegistry.getNetwork() === NetworkType.PrivateNet;
  }
}

export default EnvConfigRegistry;
