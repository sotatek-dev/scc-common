"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfigRegistry = void 0;
var enums_1 = require("../enums");
var Logger_1 = require("../Logger");
var envConfig = new Map();
var _appId = 'PP70ExC8Hr';
var _globalEnvConfig = {
    network: enums_1.NetworkType.TestNet,
};
var onNetworkChangedCallbacks = [];
var EnvConfigRegistry = (function () {
    function EnvConfigRegistry() {
    }
    EnvConfigRegistry.getCustomEnvConfig = function (key) {
        return envConfig.get(key);
    };
    EnvConfigRegistry.setCustomEnvConfig = function (key, value) {
        var logger = Logger_1.getLogger('EnvConfigRegistry');
        logger.info("setCustomEnvConfig key=" + key + ", value=" + value);
        switch (key) {
            case 'NETWORK':
                if (value !== enums_1.NetworkType.MainNet && value !== enums_1.NetworkType.TestNet && value !== enums_1.NetworkType.PrivateNet) {
                    throw new Error("Trying to set invalid value for network: " + value);
                }
                _globalEnvConfig = Object.assign(_globalEnvConfig, { network: value });
                onNetworkChangedCallbacks.forEach(function (func) { return func(value); });
                break;
            case 'APP_ID':
                this.setAppId(value);
                break;
            default:
                break;
        }
        return envConfig.set(key, value);
    };
    EnvConfigRegistry.getGlobalEnvConfig = function () {
        return _globalEnvConfig;
    };
    EnvConfigRegistry.getAppId = function () {
        return _appId;
    };
    EnvConfigRegistry.setAppId = function (appId) {
        _appId = appId;
    };
    EnvConfigRegistry.getNetwork = function () {
        return _globalEnvConfig.network;
    };
    EnvConfigRegistry.isMainnet = function () {
        return EnvConfigRegistry.getNetwork() === enums_1.NetworkType.MainNet;
    };
    EnvConfigRegistry.isTestnet = function () {
        return EnvConfigRegistry.getNetwork() === enums_1.NetworkType.TestNet;
    };
    EnvConfigRegistry.isPrivnet = function () {
        return EnvConfigRegistry.getNetwork() === enums_1.NetworkType.PrivateNet;
    };
    EnvConfigRegistry.onNetworkChanged = function (func) {
        onNetworkChangedCallbacks.push(func);
    };
    EnvConfigRegistry.isUsingRedis = function () {
        var redisEnabled = EnvConfigRegistry.getCustomEnvConfig('REDIS_ENABLED');
        if (redisEnabled === 'true') {
            return true;
        }
        return false;
    };
    return EnvConfigRegistry;
}());
exports.EnvConfigRegistry = EnvConfigRegistry;
exports.default = EnvConfigRegistry;
//# sourceMappingURL=EnvConfigRegistry.js.map