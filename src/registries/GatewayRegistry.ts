import { getLogger } from '../Logger';
import { ICurrency } from '../interfaces';
import BaseGateway from '../BaseGateway';

const logger = getLogger('GatewayRegistry');
const _registryData = new Map<string, BaseGateway>();

export class GatewayRegistry {
  public static registerGateway(currency: ICurrency | string, gatewayInstance: BaseGateway) {
    const symbol = typeof currency === 'string' ? currency : currency.symbol;
    if (_registryData.has(symbol)) {
      logger.warn(`Trying to register gateway multiple times: ${symbol}`);
    }

    _registryData.set(symbol, gatewayInstance);
  }

  public static getGatewayInstance(currency: ICurrency | string): BaseGateway {
    logger.error(`TODO: Implement me...`);
    throw new Error(`TODO: find a proper way to handle this...`);
    /*
    const symbol = typeof currency === 'string' ? currency : currency.symbol;
    if (!_registryData.has(symbol)) {
      throw new Error(`Try to get unregisterred gateway: ${symbol}`);
    }

    return _registryData.get(symbol);
    */
  }
}

export default GatewayRegistry;
