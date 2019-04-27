try {
  require('dotenv-safe').config();
} catch (e) {
  console.error(e.toString());
  process.exit(1);
}

import * as Utils from './src/Utils';
export { Utils };

export { override, implement } from './src/Utils';

import * as CCEnv from './src/EnvironmentData';
export { CCEnv };

export * from './src/types';
export * from './src/enums';
export * from './src/interfaces';
export * from './src/Logger';
export * from './src/BaseIntervalWorker';
export * from './src/BaseCrawler';
export * from './src/NativeAssetCrawler';
export * from './src/CustomAssetCrawler';
export * from './src/BaseGateway';
export * from './src/AccountBasedGateway';
export * from './src/UTXOBasedGateway';
export * from './src/BitcoinBasedGateway';
export * from './src/BaseMQConsumer';
export * from './src/BaseMQProducer';
export * from './src/BaseWebServer';
export * from './src/RPCClient';
export * from './src/Logger';

// External dependencies
import BigNumber from 'bignumber.js';
export { BigNumber };
