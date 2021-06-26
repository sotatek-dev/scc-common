import BigNumber from "bignumber.js";
import BaseGateway from "./BaseGateway";
import { ICurrency, IRawTransaction } from "./interfaces";
import { Address } from "./types";
export declare abstract class SolanaBasedGateway extends BaseGateway {
    constructor(currency: ICurrency);
    abstract getAverageSeedingFee(createAssociatedAccount?: boolean): Promise<BigNumber>;
    abstract getMinimumBalanceForRentExemption(): Promise<BigNumber>;
    abstract constructRawTransaction(fromAddress: Address, toAddress: Address, amount: BigNumber, options: {
        isConsolidate?: boolean;
        needFunding?: boolean;
        maintainRent?: boolean;
    }): Promise<IRawTransaction>;
}
