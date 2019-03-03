import express from 'express';
import morgan from 'morgan';
import BaseGateway from './BaseGateway';
import { getCurrency, getCurrencyConfig, getTokenBySymbol } from './EnvironmentData';
import * as URL from 'url';
import { getLogger } from './Logger';

const logger = getLogger('BaseWebServer');

export abstract class BaseWebServer {
  public host: string;
  public port: number;
  private app: express.Express = express();

  public constructor() {
    const config = getCurrencyConfig(getCurrency());
    if (!config) {
      throw new Error(`Cannot find configuration for ${getCurrency().toUpperCase()} at config table`);
    }
    const apiEndpoint = URL.parse(`http://${config.internalApiEndpoint}`);
    if (!apiEndpoint.protocol || !apiEndpoint.hostname || !apiEndpoint.port) {
      logger.info(`Set api endpoint: ${config.internalApiEndpoint}. Need corrected format: {host}:{port}`);
      throw new Error(`Api endpoint for ${getCurrency().toUpperCase()} have un-correct format`);
    }
    this.host = apiEndpoint.hostname;
    this.port = parseInt(apiEndpoint.port, 10);
    this.setup();
  }

  public abstract gatewayClass(): any;

  public getGateway(currency?: string): BaseGateway {
    return this.gatewayClass().getInstance(
      getTokenBySymbol(currency) ? getTokenBySymbol(currency).contractAddress : null
    );
  }

  public start() {
    this.app.listen(this.port, this.host, () => {
      console.log(`server started at http://${this.host}:${this.port}`);
    });
  }

  protected async createNewAddress(req: any, res: any) {
    const coin: string = req.params.coin;
    const address = this.getGateway(coin).createAccount();
    res.json(address);
  }

  protected async getAddressBalance(req: any, res: any) {
    const { coin, address } = req.params;
    const balance = await this.getGateway(coin).getAddressBalance(address);
    res.json({ balance });
  }

  protected async getTransactionDetails(req: any, res: any) {
    const { coin, txid } = req.params;

    // TODO: Update check txid
    const tx = await this.getGateway(coin).getOneTransaction(txid);
    if (!tx) {
      return res.status(400).json({ error: `Transaction ${txid} is not transfer type.` });
    }

    const hasMemo = getTokenBySymbol(coin).hasMemo;
    const entries: any[] = [];
    const extractedEntries = tx.extractEntries();
    extractedEntries.forEach(e => {
      entries.push({
        address: e.toAddress,
        value: parseFloat(e.amount),
        valueString: e.amount,
      });
    });

    let resObj = {
      id: txid,
      date: '',
      timestamp: tx.block.timestamp,
      blockHash: tx.block.hash,
      blockHeight: tx.block.number,
      confirmations: tx.confirmations,
      entries,
    };
    if (hasMemo) {
      resObj = Object.assign({}, resObj, { memo: tx.memo });
    }

    return res.json(resObj);
  }

  private setup() {
    this.app.use(morgan('dev'));

    this.app.get('/api/:coin/address', this.createNewAddress.bind(this));

    this.app.get('/api/:coin/address/:address/balance', this.getAddressBalance.bind(this));

    this.app.get('/api/:coin/tx/:txid', this.getTransactionDetails.bind(this));
  }
}
