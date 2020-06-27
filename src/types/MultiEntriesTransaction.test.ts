import BigNumber from 'bignumber.js';
import { CurrencyRegistry } from '../registries/CurrencyRegistry';
import { MultiEntriesTransaction } from './MultiEntriesTransaction';
import BlockHeader from './BlockHeader';

class TestTransaction extends MultiEntriesTransaction {
  public getNetworkFee(): BigNumber {
    return new BigNumber(1000);
  }
}

describe('Transaction', () => {
  let tx: TestTransaction;
  let dummyTxid = 'dummyTxid';
  let dummyBlockHash = 'dummyBlockHash';
  let dummyBlockNumber = 10000;
  let dummyBlockTimestamp = 123456;

  beforeEach(async () => {
    const blockHeaders = new BlockHeader({
      hash: dummyBlockHash,
      number: dummyBlockNumber,
      timestamp: dummyBlockTimestamp,
    });
    const outputs = [
      {
        address: 'dummy_address1',
        currency: CurrencyRegistry.Bitcoin,
        amount: "2000",
      },
      {
        address: 'dummy_address3',
        currency: CurrencyRegistry.Bitcoin,
        amount: "2000",
      }
    ];
    const inputs = [
      {
        address: 'dummy_address1',
        currency: CurrencyRegistry.Bitcoin,
        amount: "500",
      },
      {
        address: 'dummy_address2',
        currency: CurrencyRegistry.Bitcoin,
        amount: "2000",
      }
    ];
    const txProps = {
      txid: dummyTxid,
      block: blockHeaders,
      lastNetworkBlockNumber: 9999,
      inputs,
      outputs,
    };
    tx = new TestTransaction(txProps);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('getNetworkFee', () => {
    it('Network fee is calculated in derived class', async () => {
      const fee = tx.getNetworkFee();
      expect(fee.toNumber()).toBe(1000);
    });
  });

  describe('extractEntries', () => {
    it('Entries is calculated in derived class', async () => {
      const entries = tx.extractEntries();
      expect(entries.length).toBe(3);
    });
  });

  describe('extractOutputEntries', () => {
    it('should return entries with amount > 0', async () => {
      const entries = tx.extractOutputEntries();
      expect(entries.length).toBe(2);
      expect(entries[0].address).toBe('dummy_address1');
      expect(entries[0].amount.toNumber()).toBe(1500);
      expect(entries[1].address).toBe('dummy_address3');
    });
  });

  describe('extractInputEntries', () => {
    it('should return entries with amount < 0', async () => {
      const entries = tx.extractInputEntries();
      expect(entries.length).toBe(1);
      expect(entries[0].address).toBe('dummy_address2');
    });
  });

  describe('extractRecipientAddresses', () => {
    it('should return address that receives coin', async () => {
      const addresses = tx.extractRecipientAddresses();
      expect(addresses.length).toBe(2);
      expect(addresses[0]).toBe('dummy_address1');
      expect(addresses[1]).toBe('dummy_address3');
    });
  });

  describe('extractSenderAddresses', () => {
    it('should return address that sends coin', async () => {
      const addresses = tx.extractSenderAddresses();
      expect(addresses.length).toBe(1);
      expect(addresses[0]).toBe('dummy_address2');
    });
  });
});