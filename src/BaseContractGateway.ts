import BaseGateway from './BaseGateway';
import { ITokenContract } from './Interfaces';
import { Transaction, Transactions } from './types';
import {
  getFamily,
  getListTokenSymbols,
  getToken,
  getTokenByContract,
  getTokenBySymbol,
  getType,
} from './EnvironmentData';
import { implement, override } from './Utils';
import { getLogger } from './Logger';
import { Errors } from './Enums';

const logger = getLogger('BaseContractGateway');

const instances = new Map<string, BaseGateway>();

export abstract class BaseContractGateway extends BaseGateway {
  public static getInstanceFromList<T extends BaseContractGateway>(
    interactAddress: string,
    constructor?: new (interactAddress: string) => T
  ): BaseGateway {
    let mapName;
    if (interactAddress) {
      mapName = interactAddress;
    } else if (getListTokenSymbols().tokenSymbols && getListTokenSymbols().tokenSymbols.length > 0) {
      mapName = getListTokenSymbols().tokenSymbolsBuilder;
    } else {
      mapName = getFamily();
    }

    if (!instances.get(mapName)) {
      instances.set(mapName, new constructor(interactAddress));
    }
    return instances.get(mapName);
  }

  /**
   * Interacted contract can be used to sign, send, create raw transaction and get balance
   */
  public _interactedContract: ITokenContract;

  /**
   * Investigated contracts can be used to get block or multi block transactions
   * with some kind of different contracts
   */
  public _investigatedContracts: ITokenContract[] = [];

  // Gateways are singletons
  // So we hide the constructor from outsiders
  protected constructor(interactedAddress?: string) {
    super();

    if (interactedAddress) {
      interactedAddress = this.handleAddress(interactedAddress);
      this._interactedContract = {
        token: getTokenByContract(getType(), interactedAddress),
        contract: this.getContractABI(interactedAddress),
        contractAddress: interactedAddress,
      };
    }

    const listTokens = getListTokenSymbols().tokenSymbols;
    if (listTokens && listTokens.length > 0) {
      listTokens.map((tokenSymbol: any) => {
        let itgAddress = getTokenBySymbol(tokenSymbol).contractAddress;
        if (!itgAddress) {
          return;
        }
        itgAddress = this.handleAddress(itgAddress);
        this._investigatedContracts.push({
          token: getTokenByContract(getType(), itgAddress),
          contract: this.getContractABI(itgAddress),
          contractAddress: itgAddress,
        });
      });
    }
  }

  @implement
  public getInteractContract(): ITokenContract {
    // if existed
    return this._interactedContract && this._interactedContract.contractAddress ? this._interactedContract : null;
  }

  @implement
  public getContractABI(address: string): any {
    return null;
  }

  /**
   * Get balance of an address
   *
   * @param {String} address: address that want to query balance
   * @returns {string}: the current balance of address
   */
  public abstract async getAddressBalanceForToken(address: string): Promise<string>;

  /**
   *
   * @param fromBlock
   * @param toBlock
   * @param contract
   */
  public abstract async getMultiBlocksContractTransactions(
    fromBlock: number,
    toBlock: number,
    contract: ITokenContract
  ): Promise<Transactions>;

  /**
   * getMultiBlocksTransactions will find associated way to crawl lots of block transaction
   * at the same time
   * @param fromBlockNumber
   * @param toBlockNumber
   */
  @override
  public async getMultiBlocksTransactions(fromBlockNumber: number, toBlockNumber: number): Promise<Transactions> {
    // if investigated contracts was existed
    if (this.isExistedContracts()) {
      // TODO: Hard code
      const isFastestWay: boolean = this._investigatedContracts.length <= 10;
      try {
        const txs = new Transactions();
        for (const interactContract of this._investigatedContracts) {
          // set current interacted contract
          this._interactedContract = interactContract;
          if (isFastestWay) {
            txs.push(
              ...(await this.getMultiBlocksContractTransactions(fromBlockNumber, toBlockNumber, interactContract))
            );
          } else {
            txs.push(...(await super.getMultiBlocksTransactions(fromBlockNumber, toBlockNumber)));
          }
        }

        return txs;
      } catch (e) {
        // return result at next
        if (e.code !== Errors.unImplementedError.code) {
          logger.error(e.toString());
          logger.error('Try to use get multi blocks transactions with normal way');
        }
      }
    }
    return await super.getMultiBlocksTransactions(fromBlockNumber, toBlockNumber);
  }

  @override
  public async getOneTransaction(txid: string): Promise<Transaction> {
    const tx = await super.getOneTransaction(txid);
    // check transaction if transaction and its contract was existed
    if (
      tx &&
      (!this.getInteractContract() ||
        (this.getInteractContract() && tx.contractAddress === this.getInteractContract().contractAddress))
    ) {
      return tx;
    }
    return null;
  }

  @override
  public isFastGateway(): boolean {
    if (this.isExistedContracts()) {
      return this._investigatedContracts.length === 1;
    }
    return super.isFastGateway();
  }

  public isExistedContracts(): boolean {
    return this._investigatedContracts && this._investigatedContracts.length > 0;
  }
}
