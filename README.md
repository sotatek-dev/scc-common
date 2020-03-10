# Quick Start

```js
const { CurrencyRegistry, GatewayRegistry } = require("sota-common");
require("sota-eth");
require("sota-btc");

async function prepareEnvironment() {
  CurrencyRegistry.setCurrencyConfig(CurrencyRegistry.Ethereum, {
    restEndpoint: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
  });

  const btcRPCConfig = {
    protocol: process.env.BTC_RPC_PROTOCOL,
    host: process.env.BTC_RPC_HOST,
    port: process.env.BTC_RPC_PORT,
    user: process.env.BTC_RPC_USER,
    pass: process.env.BTC_RPC_PASS
  };

  CurrencyRegistry.setCurrencyConfig(CurrencyRegistry.Bitcoin, {
    rpcEndpoint: JSON.stringify(btcRPCConfig),
    restEndpoint: process.env.BTC_REST_ENDPOINT // http://priv-btc-explorer.sotatek.com/api
  });
}

async function main() {
  await prepareEnvironment();
  const ethGateway = GatewayRegistry.getGatewayInstance(
    CurrencyRegistry.Ethereum
  );
  const contractAddress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
  const tokenInfo = await ethGateway.getErc20TokenInfo(contractAddress);
  console.log(tokenInfo);

  const btcGateway = GatewayRegistry.getGatewayInstance(
    CurrencyRegistry.Bitcoin
  );
  const blockCount = await btcGateway.getBlockCount();
  console.log(`Current block count: ${blockCount}`);

  const txid =
    "4570f2cf7dc65a0fb80920b19c727563b19e392fce3f11d399e72d326d82fe8d";
  const tx = await btcGateway.getOneTransaction(txid);
  console.log(tx);
}

main()
  .then(() => {
    console.log(`FINISHED.`);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
```
