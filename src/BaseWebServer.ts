import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import BaseGateway from './BaseGateway';
import * as URL from 'url';
import BigNumber from 'bignumber.js';
import { BlockchainPlatform, WebServiceStatus } from './enums';
import { getLogger } from './Logger';
import { ICurrency } from './interfaces';
import { CurrencyRegistry, GatewayRegistry } from './registries';

const logger = getLogger('BaseWebServer');

export abstract class BaseWebServer {
  protected protocol: string;
  protected host: string;
  protected port: number;
  protected app: express.Express = express();
  protected readonly _currency: ICurrency;

  public constructor(platform: BlockchainPlatform) {
    this._currency = CurrencyRegistry.getOneNativeCurrency(platform);
    this._parseConfig(platform)
    this.setup();
  }

  protected _parseConfig(platform: BlockchainPlatform) {
    const config = CurrencyRegistry.getCurrencyConfig(this._currency);
    if (!config) {
      throw new Error(`Cannot find configuration for ${this._currency.symbol} at config table`);
    }

    const internalEndpoint = URL.parse(`${config.internalEndpoint}`);
    if (!internalEndpoint.protocol || !internalEndpoint.hostname || !internalEndpoint.port) {
      logger.error(`Api endpoint for ${this._currency.symbol} have incorrect format`, { url: config.internalEndpoint });
      throw new Error(`Api endpoint for ${this._currency.symbol} have incorrect format`);
    }

    this.protocol = internalEndpoint.protocol;
    this.host = internalEndpoint.hostname;
    this.port = parseInt(internalEndpoint.port, 10);
  }

  public start() {
    this.app.listen(this.port, this.host, () => {
      logger.info(`Server started at ${this.protocol}://${this.host}:${this.port}`);
    });
  }

  public getGateway(symbol: string): BaseGateway {
    const currency = CurrencyRegistry.getOneCurrency(symbol);
    return GatewayRegistry.getGatewayInstance(currency);
  }

  protected async createNewAddress(req: any, res: any) {
    const address = await this.getGateway(this._currency.symbol).createAccountAsync();
    res.json(address);
  }

  protected async getAddressBalance(req: any, res: any) {
    const { currency, address } = req.params;
    const balance = (await this.getGateway(currency).getAddressBalance(address)).toFixed();
    res.json({ balance });
  }

  protected async validateAddress(req: any, res: any) {
    const { address } = req.params;
    const isValid = await this.getGateway(this._currency.symbol).isValidAddressAsync(address);
    res.json({ isValid });
  }

  protected async isNeedTag(req: any, res: any) {
    const { address } = req.params;
    const isNeed = await this.getGateway(this._currency.symbol).isNeedTagAsync(address);
    res.json({ isNeed });
  }

  protected async getTransactionDetails(req: any, res: any) {
    const { currency, txid } = req.params;

    const tx = await this.getGateway(currency).getOneTransaction(txid);

    if (!tx) {
      return res.status(404).json({ error: `Transaction not found: ${txid}` });
    }

    const entries: any[] = [];
    const extractedEntries = tx.extractEntries();
    extractedEntries.forEach(e => {
      entries.push({
        address: e.address,
        value: e.amount.toFixed(),
        valueString: e.amount.toFixed(),
      });
    });
    // 24/12/2019 get transaction fee
    const fee = tx.getNetworkFee();

    let resObj = {
      id: txid,
      date: '',
      timestamp: tx.block.timestamp,
      blockHash: tx.block.hash,
      blockHeight: tx.block.number,
      confirmations: tx.confirmations,
      txFee: fee.toString(),
      entries,
    };

    resObj = { ...resObj, ...tx.extractAdditionalField() };
    return res.json(resObj);
  }

  protected async normalizeAddress(req: any, res: any) {
    const { address } = req.params;
    const normalizedAddr = await this.getGateway(this._currency.symbol).normalizeAddress(address);
    logger.info(`WebService::normalizeAddress address=${address} result=${normalizedAddr}`);
    return res.json(normalizedAddr);
  }

  protected generateSeed(req: any, res: any) {
    const mnemonic = this.getGateway(this._currency.symbol).generateSeed();
    return res.json(mnemonic);
  }

  protected async createNewHdWalletAddress(req: any, res: any) {
    const { accountIndex, path, seed } = req.query;
    const address = await this.getGateway(this._currency.symbol).createAccountHdWalletAsync({
      accountIndex,
      path,
      seed,
    });
    return res.json(address);
  }

  protected async checkHealth() {
    return { status: await this._getHealthStatus() };
  }

  protected async _getHealthStatus(): Promise<WebServiceStatus> {
    return WebServiceStatus.OK;
  }

  protected async estimateFee(req: any, res: any) {
    const { currency } = req.params;
    const { total_inputs, recent_withdrawal_fee, use_lower_network_fee } = req.query;
    const totalInputs = parseInt(total_inputs, 10);
    const currentCurrency = CurrencyRegistry.getOneCurrency(currency);
    const isConsolidate = !currentCurrency.isNative;

    const fee: BigNumber = await this.getGateway(currency).estimateFee({
      totalInputs,
      useLowerNetworkFee: use_lower_network_fee,
      isConsolidate,
      recentWithdrawalFee: recent_withdrawal_fee,
    });
    return res.json({
      fee: fee.toNumber(),
    });
  }

  protected setup() {
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())

    // Log request and response
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      const originalEnd = res.end;
      const originalWrite = res.write;
      const originalJson = res.json;
      let responseBodyString: string = null;
      let responseBodyJson = null;
      const chunks = [];

      res.write = function (chunk): boolean {
        chunks.push(new Buffer(chunk));
        return originalWrite.apply(res, arguments);
      };

      res.json = function (bodyJson) {
        responseBodyJson = bodyJson;
        return originalJson.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk) {
          chunks.push(Buffer.from(chunk));
        }

        responseBodyString = Buffer.concat(chunks).toString('utf8');
        originalEnd.apply(res, arguments);
        logRequest(req, res, timestamp, responseBodyString, responseBodyJson);
      };

      next();
    });

    this.app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next(err)
      }

      res.status(500)
      res.render('error', { error: err })
    })

    this.app.get('/api/:currency/address', async (req, res) => {
      try {
        await this.createNewAddress(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::createNewAddress error: `, e);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/balance', async (req, res) => {
      try {
        await this.getAddressBalance(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::getAddressBalance error: `, e);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/validate', async (req, res) => {
      try {
        await this.validateAddress(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::validateAddress error: `, e);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/tag', async (req, res) => {
      try {
        await this.isNeedTag(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::isNeedTag error: `, e);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/tx/:txid', async (req, res) => {
      try {
        await this.getTransactionDetails(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::getTransactionDetails error: `, e);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/normalized', async (req, res) => {
      try {
        await this.normalizeAddress(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::normalizeAddress error: `, e);
        res.status(500).json({ error: e.toString() });
      }
    });

    this.app.get('/api/:currency/generate_seed', async (req, res) => {
      try {
        await this.generateSeed(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::generateSeed error: `, e);
        res.status(500).json({ error: e.toString() });
      }
    });

    this.app.get('/api/health', async (req, res) => {
      res.status(200).json(await this.checkHealth());
    });

    this.app.get('/api/:currency/address/hd_wallet', async (req, res) => {
      try {
        await this.createNewHdWalletAddress(req, res);
      } catch (e) {
        logger.error(`${this.constructor.name}::createNewHdWalletAddress error: `, e);
        res.status(500).json({ error: e.toString() });
      }
    });

    this.app.get(
      '/api/:currency/estimate_fee/:total_inputs*?/:recent_withdrawal_fee*?/:use_lower_network_fee*?',
      async (req, res) => {
        try {
          await this.estimateFee(req, res);
        } catch (e) {
          logger.error(`${this.constructor.name}::estimateFee error: `, e);
          res.status(500).json({ error: e.toString() });
        }
      }
    );

    this.app.use(function(req, res){
      res.status(404).json({ error: 'API Not Found' });
    });
  }

  public getProtocol(): string {
    return this.protocol;
  }

  public getHost(): string {
    return this.host;
  }

  public getPort(): number {
    return this.port;
  }
}

function logRequest(req: express.Request, res: express.Response, requestTimestamp: string, responseBodyString: string, responseBodyJson: any) {
  const request = {
    timestamp: requestTimestamp,
    method: req.method,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    ip: req.ip,
    query: req.query,
    params: req.params,
    body: req.body,
    headers: req.headers,
  };
  const response = {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    responseBodyString,
    responseBodyJson,
  };
  logger.info(`${req.method} ${req.originalUrl}`, { request, response });
}