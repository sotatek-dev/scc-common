import express from 'express';
import BaseGateway from './BaseGateway';
import { BlockchainPlatform, WebServiceStatus } from './enums';
import { ICurrency } from './interfaces';
export declare abstract class BaseWebServer {
    protected protocol: string;
    protected host: string;
    protected port: number;
    protected app: express.Express;
    protected readonly _currency: ICurrency;
    constructor(platform: BlockchainPlatform);
    protected _parseConfig(platform: BlockchainPlatform): void;
    start(): void;
    getGateway(symbol: string): BaseGateway;
    protected createNewAddress(req: any, res: any): Promise<void>;
    protected getAddressBalance(req: any, res: any): Promise<void>;
    protected validateAddress(req: any, res: any): Promise<void>;
    protected isNeedTag(req: any, res: any): Promise<void>;
    protected getTransactionDetails(req: any, res: any): Promise<any>;
    protected normalizeAddress(req: any, res: any): Promise<any>;
    protected generateSeed(req: any, res: any): any;
    protected createNewHdWalletAddress(req: any, res: any): Promise<any>;
    protected checkHealth(): Promise<{
        status: WebServiceStatus;
    }>;
    protected _getHealthStatus(): Promise<WebServiceStatus>;
    protected estimateFee(req: any, res: any): Promise<any>;
    protected setup(): void;
    getProtocol(): string;
    getHost(): string;
    getPort(): number;
}
