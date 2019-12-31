import express from 'express';
import morgan from 'morgan';
import util from 'util';
import BaseGateway from './BaseGateway';
import * as URL from 'url';
import { Transaction } from './types';
import BigNumber from 'bignumber.js';
import { BlockchainPlatform } from './enums';
import { getLogger } from './Logger';
import { ICurrency } from './interfaces';
import { CurrencyRegistry, GatewayRegistry } from './registries';

const logger = getLogger('BaseWebServer');

export abstract class BaseWebServer {
  public readonly protocol: string;
  public readonly host: string;
  public readonly port: number;
  protected app: express.Express = express();
  protected readonly _currency: ICurrency;

  public constructor(platform: BlockchainPlatform) {
    this._currency = CurrencyRegistry.getOneNativeCurrency(platform);
    const config = CurrencyRegistry.getCurrencyConfig(this._currency);
    if (!config) {
      throw new Error(`Cannot find configuration for ${this._currency.symbol} at config table`);
    }

    const internalEndpoint = URL.parse(`${config.internalEndpoint}`);
    if (!internalEndpoint.protocol || !internalEndpoint.hostname || !internalEndpoint.port) {
      logger.info(`Set api endpoint: ${config.internalEndpoint}. Need corrected format: {host}:{port}`);
      throw new Error(`Api endpoint for ${this._currency.symbol} have incorrect format`);
    }

    this.protocol = internalEndpoint.protocol;
    this.host = internalEndpoint.hostname;
    this.port = parseInt(internalEndpoint.port, 10);
    this.setup();
  }

  public start() {
    this.app.listen(this.port, this.host, () => {
      console.log(`server started at ${this.protocol}://${this.host}:${this.port}`);
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
    // TODO: Update check txid
    // TODO: currently hard code for workaround. Fix me later...
    if (currency.startsWith('erc20.')) {
      return this._getErc20TransactionDetails(req, res);
    }

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

  // TODO: FIXME
  // This workaround is pretty ugly, need fix
  protected async _getErc20TransactionDetails(req: any, res: any) {
    const { currency, txid } = req.params;
    const gw = this.getGateway(currency) as any;
    const txs = await gw.getTransactionsByTxid(txid);

    if (!txs || !txs.length) {
      return res.status(404).json({ error: `Transaction not found: ${txid}` });
    }

    const entries: any[] = [];
    txs.forEach((tx: any) => {
      const extractedEntries = tx.extractEntries();
      extractedEntries.forEach((e: any) => {
        const entry = entries.find(_e => _e.address === e.address);
        if (entry) {
          const value = new BigNumber(entry.value).plus(e.amount);
          entry.value = value.toFixed();
          entry.valueString = value.toFixed();
          return;
        }

        entries.push({
          address: e.address,
          value: e.amount.toFixed(),
          valueString: e.amount.toFixed(),
        });
      });
    });

    let resObj = {
      id: txid,
      date: '',
      timestamp: txs[0].block.timestamp,
      blockHash: txs[0].block.hash,
      blockHeight: txs[0].block.number,
      confirmations: txs[0].confirmations,
      entries,
    };

    resObj = { ...resObj, ...txs[0].extractAdditionalField() };
    return res.json(resObj);
  }

  protected async normalizeAddress(req: any, res: any) {
    const { address } = req.params;
    const normalizedAddr = await this.getGateway(this._currency.symbol).normalizeAddress(address);
    logger.info(`WebService::normalizeAddress address=${address} result=${normalizedAddr}`);
    return res.json(normalizedAddr);
  }

  protected async _healthChecker() {
    return { webService: { isOK: true } };
  }

  protected setup() {
    this.app.use(morgan('dev'));

    this.app.get('/api/:currency/address', async (req, res) => {
      try {
        await this.createNewAddress(req, res);
      } catch (e) {
        logger.error(`createNewAddress err=${util.inspect(e)}`);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/balance', async (req, res) => {
      try {
        await this.getAddressBalance(req, res);
      } catch (e) {
        logger.error(`getAddressBalance err=${util.inspect(e)}`);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/validate', async (req, res) => {
      try {
        await this.validateAddress(req, res);
      } catch (e) {
        logger.error(`validateAddress err=${util.inspect(e)}`);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/tag', async (req, res) => {
      try {
        await this.isNeedTag(req, res);
      } catch (e) {
        logger.error(`validateAddress err=${util.inspect(e)}`);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/tx/:txid', async (req, res) => {
      try {
        await this.getTransactionDetails(req, res);
      } catch (e) {
        logger.error(`getTransactionDetails err=${util.inspect(e)}`);
        res.status(500).json({ error: e.message || e.toString() });
      }
    });

    this.app.get('/api/:currency/address/:address/normalized', async (req, res) => {
      try {
        await this.normalizeAddress(req, res);
      } catch (e) {
        logger.error(`convertChecksumAddress err=${util.inspect(e)}`);
        res.status(500).json({ error: e.toString() });
      }
    });

    this.app.get('/api/health', async (req, res) => {
      res.status(200).json(await this._healthChecker());
    });
  }
}
