import BigNumber from 'bignumber.js';
import { CurrencyRegistry } from '../registries/CurrencyRegistry';
import { UTXOBasedTransaction } from './UTXOBasedTransaction';
import BlockHeader from './BlockHeader';

class TestTransaction extends UTXOBasedTransaction {
  // Nothing
}

describe('Transaction', () => {
  let tx: TestTransaction;
  let dummyTxid = 'dummyTxid';
  let dummyBlockHash = 'dummyBlockHash';
  let dummyBlockNumber = 10000;
  let dummyBlockTimestamp = 123456;
  let vin = [
    {
      addr: 'dummy_address1',
      txid: dummyTxid,
      vout: 1,
      value: 0.5,
      sequence: 1,
      scriptSig: {
        asm: 'dummy',
        hex: 'dummy',
      },
    },
    {
      addr: 'dummy_address2',
      txid: dummyTxid,
      vout: 1,
      value: 2,
      sequence: 1,
      scriptSig: {
        asm: 'dummy',
        hex: 'dummy',
      },
    }
  ];
  let vout = [
    {
      value: 1,
      n: 0,
      scriptPubKey: {
        asm: 'dummy',
        hex: 'dummy',
        type: 'dummy',
        addresses: [
          'dummy_address1'
        ],
      }
    },
    {
      value: 1.3,
      n: 0,
      scriptPubKey: {
        asm: 'dummy',
        hex: 'dummy',
        type: 'dummy',
        addresses: [
          'dummy_address3'
        ],
      }
    }
  ]

  beforeEach(async () => {
    const blockHeader = new BlockHeader({
      hash: dummyBlockHash,
      number: dummyBlockNumber,
      timestamp: dummyBlockTimestamp,
    });

    const txProps = {
      txid: dummyTxid,
      confirmations: 100,
      vin,
      vout,
      size: 12345,
      version: 12345,
      time: 12345,
      locktime: 12345,
      blocktime: blockHeader.timestamp,
      blockhash: blockHeader.hash,
    };
    tx = new TestTransaction(CurrencyRegistry.Bitcoin, txProps, blockHeader);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('getNetworkFee', () => {
    it('Network fee is total output subtract total input', async () => {
      const fee = tx.getNetworkFee();
      expect(fee.toNumber()).toBe(0.2 * tx.getSatoshiFactor());
    });
  });

  describe('extractEntries', () => {
    it('Entries is merged result of vin and vout', async () => {
      const entries = tx.extractEntries();
      expect(entries.length).toBe(3);
    });
  });

  describe('extractOutputEntries', () => {
    it('should return entries with amount > 0', async () => {
      const entries = tx.extractOutputEntries();
      expect(entries.length).toBe(2);
      expect(entries[0].address).toBe('dummy_address1');
      expect(entries[0].amount.toNumber()).toBe(0.5 * tx.getSatoshiFactor());
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