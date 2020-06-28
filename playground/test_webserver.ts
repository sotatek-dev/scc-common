require('dotenv').config();

import {BaseWebServer} from '../src/BaseWebServer';
import { CurrencyRegistry } from '../src/registries';
import { BlockchainPlatform } from '../src/enums';

CurrencyRegistry.setCurrencyConfig(CurrencyRegistry.Ethereum, {
  currency: CurrencyRegistry.Ethereum.symbol,
  network: 'mainnet',
  chainId: '1',
  chainName: 'mainnet',
  averageBlockTime: 15000,
  requiredConfirmations: 1,
  restEndpoint: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
  internalEndpoint: 'http://localhost:47001',
  rpcEndpoint: null,
  explorerEndpoint: null,
});

class TestWebServer extends BaseWebServer {
  //
}

setTimeout(() => {
  const webServer = new TestWebServer(BlockchainPlatform.Ethereum);
  webServer.start();
}, 1000);

