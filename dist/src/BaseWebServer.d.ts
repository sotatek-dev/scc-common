import express from 'express';
import BaseGateway from './BaseGateway';
import { BlockchainPlatform } from './enums';
import { ICurrency } from './interfaces';
export declare abstract class BaseWebServer {
    readonly protocol: string;
    readonly host: string;
    readonly port: number;
    protected app: express.Express;
    protected readonly _currency: ICurrency;
    constructor(platform: BlockchainPlatform);
    start(): void;
    getGateway(symbol: string): BaseGateway;
    protected createNewAddress(req: any, res: any): Promise<void>;
    protected getAddressBalance(req: any, res: any): Promise<void>;
    protected validateAddress(req: any, res: any): Promise<void>;
    protected isNeedTag(req: any, res: any): Promise<void>;
    protected getTransactionDetails(req: any, res: any): Promise<any>;
    protected _getErc20TransactionDetails(req: any, res: any): Promise<any>;
    protected normalizeAddress(req: any, res: any): Promise<any>;
    protected _healthChecker(): Promise<{
        webService: {
            isOK: boolean;
        };
    }>;
    protected setup(): void;
}
