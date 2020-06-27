import { ICurrency } from '../interfaces';
import BaseGateway from '../BaseGateway';
export declare class GatewayRegistry {
    static getGatewayInstance(currency: ICurrency | string): BaseGateway;
    static registerLazyCreateMethod(currency: ICurrency | string, func: () => BaseGateway): void;
    protected static registerGateway(currency: ICurrency | string, gatewayInstance: BaseGateway): void;
}
export default GatewayRegistry;
