import BlockHeader from './BlockHeader';
import TransferOutput from './TransferOutput';

interface ITransactionProps {
  readonly txid: string;
  readonly height: number;
  readonly timestamp: number;
  confirmations: number;
}

export abstract class Transaction implements ITransactionProps {
  public readonly txid: string;
  public readonly height: number;
  public readonly timestamp: number;
  public readonly block: BlockHeader;
  // Its value is empty or a contract address
  public contractAddress: string;
  public confirmations: number;

  constructor(props: ITransactionProps, block: BlockHeader) {
    Object.assign(this, props);
    this.block = block;
  }

  /**
   * Calculate and extract transfer output from a transaction
   *
   * @returns {TransferOutput[]} array of transfer outputs
   */
  public abstract extractTransferOutputs(): TransferOutput[];

  /**
   * Extract recipient addresses.
   *
   * @returns {string[]} array of addresses under string format
   */
  public extractRecipientAddresses(): string[] {
    // Recipients are addresses from transfer outputs
    // which have positive amount
    return this.extractTransferOutputs().map(t => t.toAddress);
  }

  public getExtraDepositData(): any {
    return {
      blockHash: this.block.hash,
      blockNumber: this.height,
      blockTimestamp: this.timestamp,
    };
  }

  public abstract getNetworkFee(): string;
}

export default Transaction;
