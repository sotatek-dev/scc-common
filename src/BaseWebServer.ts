import express from 'express';
import morgan from 'morgan';
import BaseGateway from './BaseGateway';
import { getTokenBySymbol } from './EnvironmentData';

export abstract class BaseWebServer {
  public host: string = 'localhost';
  public port: number = 8888;
  private app: express.Express = express();

  public constructor() {
    this.port = parseInt(process.env.PORT, 10);
    this.host = process.env.HOST;
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

  private setup() {
    this.app.use(morgan('dev'));

    this.app.get('/api/:coin/address', async (req, res) => {
      const coin: string = req.params.coin;
      const address = this.getGateway(coin).createAccount();
      res.json(address);
    });

    this.app.get('/api/:coin/address/:address/balance', async (req, res) => {
      const { coin, address } = req.params;
      const balance = await this.getGateway(coin).getAddressBalance(address);
      res.json({ balance });
    });

    this.app.get('/api/:coin/tx/:txid', async (req, res) => {
      const { coin, txid } = req.params;

      // TODO: Update check txid
      const tx = await this.getGateway(coin).getOneTransaction(txid);
      const senderAddr = tx.fromAddress;
      const receiverAddr = tx.toAddress;
      const amount = parseFloat(tx.amount);

      if (Number.isNaN(amount)) {
        return res.status(400).json({ error: `Transaction ${txid} is not transfer type.` });
      }

      const hasMemo = getTokenBySymbol(coin).hasMemo;

      const entries: any[] = [];
      entries.push({
        address: senderAddr,
        value: -amount,
        valueString: (-amount).toString(),
      });

      entries.push({
        address: receiverAddr,
        value: amount,
        valueString: amount.toString(),
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
    });
  }
}
