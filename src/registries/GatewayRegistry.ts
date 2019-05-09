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
    const symbol = typeof currency === 'string' ? currency : currency.symbol;
    if (!_registryData.has(symbol)) {
      return null;
    }

    return _registryData.get(symbol);
  }
}

export default GatewayRegistry;
