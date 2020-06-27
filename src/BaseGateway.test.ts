import BigNumber from 'bignumber.js';
import { CurrencyRegistry } from './registries/CurrencyRegistry';
import { BaseGateway } from './BaseGateway';
import { Account, Block, Transaction } from './types';
import { TransactionStatus } from './enums';
import { ICurrency, ISignedRawTransaction, ISubmittedTransaction } from './interfaces';
import BlockHeader from './types/BlockHeader';

class TestGateway extends BaseGateway {
  public static createTestInstance(currency: ICurrency): TestGateway {
    const gw = new TestGateway(currency);
    return gw;
  }

  public async createAccountAsync(): Promise<Account> {
    return new Account('dummy', 'dummy');
  }

  public async getAccountFromPrivateKey(privateKey: string): Promise<Account> {
    return new Account('dummy', 'dummy');
  }

  public async getBlockCount(): Promise<number> {
    return 10000;
  }

  public async getAddressBalance(address: string): Promise<BigNumber> {
    return new BigNumber(1000);
  }

  public async getTransactionStatus(txid: string): Promise<TransactionStatus> {
    return TransactionStatus.UNKNOWN;
  }

  public async signRawTransaction(unsignedRaw: string, secret: string | string[]): Promise<ISignedRawTransaction> {
    throw new Error("Method not implemented.");
  }

  public async sendRawTransaction(signedRawTx: string): Promise<ISubmittedTransaction> {
    throw new Error("Method not implemented.");
  }

  public async getAverageSeedingFee(): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  protected async _getOneBlock(blockHash: string | number): Promise<Block> {
    throw new Error("Method not implemented.");
  }

  protected async _getOneTransaction(txid: string): Promise<Transaction> {
    throw new Error("Method not implemented.");
  }

}

describe('BaseGateway', () => {
  let gw: TestGateway;
  let dummyTxid = 'dummyTxid';
  let dummyBlockHash = 'dummyBlockHash';
  let dummyBlockNumber = 10000;
  let dummyBlockTimestamp = 123456;
  let dummyTxTimestamp = 123456789;
  let dummyConfirmations = 10;

  beforeEach(async () => {
    const txProps = {
      txid: dummyTxid,
      height: dummyBlockNumber,
      timestamp: dummyTxTimestamp,
      confirmations: dummyConfirmations,
    };
    const blockHeaders = new BlockHeader({
      hash: dummyBlockHash,
      number: dummyBlockNumber,
      timestamp: dummyBlockTimestamp,
    });
    gw = TestGateway.createTestInstance(CurrencyRegistry.Bitcoin);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('getCurrency', () => {
    it('should be currency when initializing', async () => {
      const currency = gw.getCurrency();
      expect(currency).toBe(CurrencyRegistry.Bitcoin);
    });
  });
});