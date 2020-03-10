"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../Logger");
var logger = Logger_1.getLogger('GatewayRegistry');
var _factory = new Map();
var _registryData = new Map();
var GatewayRegistry = (function () {
    function GatewayRegistry() {
    }
    GatewayRegistry.getGatewayInstance = function (currency) {
        var symbol = typeof currency === 'string' ? currency : currency.symbol;
        if (_registryData.has(symbol)) {
            return _registryData.get(symbol);
        }
        if (_factory.has(symbol)) {
            var factoryCreate = _factory.get(symbol);
            var gateway = factoryCreate();
            GatewayRegistry.registerGateway(currency, gateway);
            return gateway;
        }
        else {
            return null;
        }
    };
    GatewayRegistry.registerLazyCreateMethod = function (currency, func) {
        var symbol = typeof currency === 'string' ? currency : currency.symbol;
        logger.info("GatewayRegistry::registerLazyCreateMethod currency=" + symbol);
        _factory.set(symbol, func);
    };
    GatewayRegistry.registerGateway = function (currency, gatewayInstance) {
        var symbol = typeof currency === 'string' ? currency : currency.symbol;
        if (_registryData.has(symbol)) {
            logger.warn("GatewayRegistry::registerGateway trying to register gateway multiple times: " + symbol);
        }
        else {
            logger.info("GatewayRegistry::registerGateway currency=" + symbol);
        }
        _registryData.set(symbol, gatewayInstance);
    };
    return GatewayRegistry;
}());
exports.GatewayRegistry = GatewayRegistry;
exports.default = GatewayRegistry;
//# sourceMappingURL=GatewayRegistry.js.map