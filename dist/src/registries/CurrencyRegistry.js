"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../Logger");
var enums_1 = require("../enums");
var logger = Logger_1.getLogger('CurrencyRegistry');
var allCurrencies = new Map();
var allCurrencyConfigs = new Map();
var allErc20Tokens = [];
var allTrc20Tokens = [];
var allOmniAssets = [];
var allEosTokens = [];
var allBepTokens = [];
var allTerraTokens = [];
var allCosmosTokens = [];
var onCurrencyRegisteredCallbacks = [];
var onSpecificCurrencyRegisteredCallbacks = new Map();
var onCurrencyConfigSetCallbacks = [];
var eventCallbacks = {
    'erc20-registered': Array(),
    'trc20-registered': Array(),
    'omni-registered': Array(),
    'eos-token-registered': Array(),
    'bep-token-registered': Array(),
    'terra-token-registered': Array(),
    'cosmos-token-registered': Array(),
};
var Bitcoin = {
    symbol: enums_1.BlockchainPlatform.Bitcoin,
    networkSymbol: enums_1.BlockchainPlatform.Bitcoin,
    name: 'Bitcoin',
    platform: enums_1.BlockchainPlatform.Bitcoin,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 8,
    nativeScale: 0,
    hasMemo: false,
};
var Ethereum = {
    symbol: enums_1.BlockchainPlatform.Ethereum,
    networkSymbol: enums_1.BlockchainPlatform.Ethereum,
    name: 'Ethereum',
    platform: enums_1.BlockchainPlatform.Ethereum,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 18,
    nativeScale: 0,
    hasMemo: false,
};
var Cardano = {
    symbol: enums_1.BlockchainPlatform.Cardano,
    networkSymbol: enums_1.BlockchainPlatform.Cardano,
    name: 'Cardano',
    platform: enums_1.BlockchainPlatform.Cardano,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 6,
    nativeScale: 0,
    hasMemo: false,
};
var BitcoinCash = {
    symbol: enums_1.BlockchainPlatform.BitcoinCash,
    networkSymbol: enums_1.BlockchainPlatform.BitcoinCash,
    name: 'BitcoinCash',
    platform: enums_1.BlockchainPlatform.BitcoinCash,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 8,
    nativeScale: 0,
    hasMemo: false,
};
var BitcoinSV = {
    symbol: enums_1.BlockchainPlatform.BitcoinSV,
    networkSymbol: enums_1.BlockchainPlatform.BitcoinSV,
    name: 'BitcoinSV',
    platform: enums_1.BlockchainPlatform.BitcoinSV,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 8,
    nativeScale: 0,
    hasMemo: false,
};
var EOS = {
    symbol: enums_1.BlockchainPlatform.EOS,
    networkSymbol: enums_1.BlockchainPlatform.EOS,
    name: 'EOS',
    platform: enums_1.BlockchainPlatform.EOS,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 0,
    nativeScale: 4,
    hasMemo: true,
};
var Litecoin = {
    symbol: enums_1.BlockchainPlatform.Litecoin,
    networkSymbol: enums_1.BlockchainPlatform.Litecoin,
    name: 'Litecoin',
    platform: enums_1.BlockchainPlatform.Litecoin,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 8,
    nativeScale: 0,
    hasMemo: false,
};
var Dash = {
    symbol: enums_1.BlockchainPlatform.Dash,
    networkSymbol: enums_1.BlockchainPlatform.Dash,
    name: 'Dash',
    platform: enums_1.BlockchainPlatform.Dash,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 8,
    nativeScale: 0,
    hasMemo: false,
};
var EthereumClasssic = {
    symbol: enums_1.BlockchainPlatform.EthereumClassic,
    networkSymbol: enums_1.BlockchainPlatform.EthereumClassic,
    name: 'EthereumClassic',
    platform: enums_1.BlockchainPlatform.EthereumClassic,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 18,
    nativeScale: 0,
    hasMemo: false,
};
var NEO = {
    symbol: enums_1.BlockchainPlatform.NEO,
    networkSymbol: enums_1.BlockchainPlatform.NEO,
    name: 'NEO',
    platform: enums_1.BlockchainPlatform.NEO,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 0,
    nativeScale: 0,
    hasMemo: false,
};
var NEOGAS = {
    symbol: 'gas',
    networkSymbol: 'gas',
    name: 'GAS',
    platform: enums_1.BlockchainPlatform.NEO,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 0,
    nativeScale: 8,
    hasMemo: false,
};
var Tomo = {
    symbol: enums_1.BlockchainPlatform.Tomo,
    networkSymbol: enums_1.BlockchainPlatform.Tomo,
    name: 'Tomo',
    platform: enums_1.BlockchainPlatform.Tomo,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 18,
    nativeScale: 0,
    hasMemo: false,
};
var Ripple = {
    symbol: enums_1.BlockchainPlatform.Ripple,
    networkSymbol: enums_1.BlockchainPlatform.Ripple,
    name: 'Ripple',
    platform: enums_1.BlockchainPlatform.Ripple,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 0,
    nativeScale: 6,
    hasMemo: true,
};
var Stellar = {
    symbol: enums_1.BlockchainPlatform.Stellar,
    networkSymbol: enums_1.BlockchainPlatform.Stellar,
    name: 'Stellar',
    platform: enums_1.BlockchainPlatform.Stellar,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 0,
    nativeScale: 6,
    hasMemo: true,
};
var Nem = {
    symbol: enums_1.BlockchainPlatform.Nem,
    networkSymbol: enums_1.BlockchainPlatform.Nem,
    name: 'XEM',
    platform: enums_1.BlockchainPlatform.Nem,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 6,
    nativeScale: 0,
    hasMemo: true,
};
var Tron = {
    symbol: enums_1.BlockchainPlatform.Tron,
    networkSymbol: enums_1.BlockchainPlatform.Tron,
    name: 'Tron',
    platform: enums_1.BlockchainPlatform.Tron,
    isNative: true,
    isUTXOBased: true,
    humanReadableScale: 8,
    nativeScale: 6,
    hasMemo: false,
};
var Binance = {
    symbol: enums_1.BlockchainPlatform.Binance,
    networkSymbol: enums_1.BlockchainPlatform.Binance,
    name: 'Binance',
    platform: enums_1.BlockchainPlatform.Binance,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 8,
    nativeScale: 0,
    hasMemo: true,
};
var Terra = {
    symbol: enums_1.BlockchainPlatform.Terra,
    networkSymbol: enums_1.BlockchainPlatform.Terra,
    name: 'Terra',
    platform: enums_1.BlockchainPlatform.Terra,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 8,
    type: enums_1.TransactionBaseType.COSMOS,
    nativeScale: 0,
    hdPath: "m/44'/330'/0'/0/",
    hasMemo: true,
};
var Cosmos = {
    symbol: enums_1.BlockchainPlatform.Cosmos,
    networkSymbol: enums_1.BlockchainPlatform.Cosmos,
    name: 'Cosmos',
    platform: enums_1.BlockchainPlatform.Cosmos,
    isNative: true,
    isUTXOBased: false,
    humanReadableScale: 8,
    type: enums_1.TransactionBaseType.COSMOS,
    nativeScale: 0,
    hdPath: "m/44'/330'/0'/0/",
    hasMemo: true,
};
var nativeCurrencies = [
    Bitcoin,
    Ethereum,
    Cardano,
    BitcoinCash,
    BitcoinSV,
    EOS,
    Litecoin,
    Dash,
    EthereumClasssic,
    NEO,
    NEOGAS,
    Tomo,
    Ripple,
    Stellar,
    Nem,
    Tron,
    Binance,
    Terra,
    Cosmos,
];
var CurrencyRegistry = (function () {
    function CurrencyRegistry() {
    }
    CurrencyRegistry.registerCurrency = function (c) {
        var symbol = c.symbol.toLowerCase();
        logger.info("CurrencyRegistry::registerCurrency symbol=" + symbol);
        if (allCurrencies.has(symbol)) {
            logger.warn("Currency register multiple times: " + symbol);
            return false;
        }
        allCurrencies.set(symbol, c);
        onCurrencyRegisteredCallbacks.forEach(function (callback) { return callback(c); });
        if (onSpecificCurrencyRegisteredCallbacks.has(symbol)) {
            onSpecificCurrencyRegisteredCallbacks.get(symbol).forEach(function (callback) { return callback(); });
        }
        return true;
    };
    CurrencyRegistry.registerOmniAsset = function (propertyId, networkSymbol, name, scale) {
        logger.info("register Omni: propertyId=" + propertyId + ", networkSymbol=" + networkSymbol + ", name=" + name + ", scale=" + scale);
        var platform = enums_1.BlockchainPlatform.Bitcoin;
        var symbol = [enums_1.TokenType.OMNI, propertyId].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.OMNI,
            name: name,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            propertyId: propertyId,
            humanReadableScale: 0,
            nativeScale: scale,
            hasMemo: false,
        };
        allOmniAssets.push(currency);
        eventCallbacks['omni-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.registerErc20Token = function (contractAddress, networkSymbol, name, decimals) {
        logger.info("register erc20: contract=" + contractAddress + ", networkSymbol=" + networkSymbol + ", name=" + name + ", decimals=" + decimals);
        var platform = enums_1.BlockchainPlatform.Ethereum;
        var symbol = [enums_1.TokenType.ERC20, contractAddress].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.ERC20,
            name: name,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            contractAddress: contractAddress,
            decimals: decimals,
            humanReadableScale: decimals,
            nativeScale: 0,
            hasMemo: false,
        };
        allErc20Tokens.push(currency);
        eventCallbacks['erc20-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.unregisterErc20Token = function (contractAddress) {
        logger.info("unregister erc20: contract=" + contractAddress);
        var symbol = [enums_1.TokenType.ERC20, contractAddress].join('.');
        for (var i = 0; i < allErc20Tokens.length; i++) {
            var token = allErc20Tokens[i];
            if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
                allErc20Tokens.splice(i, 1);
                break;
            }
        }
        CurrencyRegistry.unregisterCurrency(symbol);
    };
    CurrencyRegistry.registerTrc20Token = function (contractAddress, networkSymbol, name, decimals) {
        logger.info("register trc20: contract=" + contractAddress + ", networkSymbol=" + networkSymbol + ", name=" + name + ", decimals=" + decimals);
        var platform = enums_1.BlockchainPlatform.Tomo;
        var symbol = [enums_1.TokenType.ERC20Tomo, contractAddress].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.ERC20Tomo,
            name: name,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            contractAddress: contractAddress,
            decimals: decimals,
            humanReadableScale: decimals,
            nativeScale: 0,
            hasMemo: false,
        };
        allTrc20Tokens.push(currency);
        eventCallbacks['trc20-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.registerEosToken = function (code, networkSymbol, scale) {
        var platform = enums_1.BlockchainPlatform.EOS;
        var symbol = [enums_1.TokenType.EOS, networkSymbol].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.EOS,
            name: networkSymbol,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            code: code,
            humanReadableScale: 0,
            nativeScale: scale,
            hasMemo: true,
        };
        allEosTokens.push(currency);
        eventCallbacks['eos-token-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.registerBepToken = function (originSymbol, networkSymbol, scale) {
        var platform = enums_1.BlockchainPlatform.Binance;
        var symbol = [enums_1.TokenType.BEP, networkSymbol].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.BEP,
            name: originSymbol,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            humanReadableScale: scale,
            nativeScale: 0,
            originSymbol: originSymbol,
            hasMemo: true,
        };
        allBepTokens.push(currency);
        eventCallbacks['bep-token-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.registerTerraToken = function (code, networkSymbol, scale) {
        var platform = enums_1.BlockchainPlatform.Terra;
        var symbol = [enums_1.TokenType.TERRA, networkSymbol].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.TERRA,
            name: code,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            humanReadableScale: scale,
            type: enums_1.TransactionBaseType.COSMOS,
            nativeScale: 0,
            code: code,
            hdPath: CurrencyRegistry.getOneCurrency(enums_1.BlockchainPlatform.Terra).hdPath,
            hasMemo: true,
        };
        allTerraTokens.push(currency);
        eventCallbacks['terra-token-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.registerCosmosToken = function (code, networkSymbol, scale) {
        var platform = enums_1.BlockchainPlatform.Cosmos;
        var symbol = [enums_1.TokenType.COSMOS, networkSymbol].join('.');
        var currency = {
            symbol: symbol,
            networkSymbol: networkSymbol,
            tokenType: enums_1.TokenType.COSMOS,
            name: code,
            platform: platform,
            isNative: false,
            isUTXOBased: false,
            humanReadableScale: scale,
            type: enums_1.TransactionBaseType.COSMOS,
            nativeScale: 0,
            code: code,
            hdPath: CurrencyRegistry.getOneCurrency(enums_1.BlockchainPlatform.Cosmos).hdPath,
            hasMemo: true,
        };
        allCosmosTokens.push(currency);
        eventCallbacks['cosmos-token-registered'].forEach(function (callback) { return callback(currency); });
        return CurrencyRegistry.registerCurrency(currency);
    };
    CurrencyRegistry.getOneOmniAsset = function (propertyId) {
        var symbol = [enums_1.TokenType.OMNI, propertyId].join('.');
        return CurrencyRegistry.getOneCurrency(symbol);
    };
    CurrencyRegistry.getAllOmniAssets = function () {
        return allOmniAssets;
    };
    CurrencyRegistry.getOneErc20Token = function (contractAddress) {
        var symbol = [enums_1.TokenType.ERC20, contractAddress].join('.');
        return CurrencyRegistry.getOneCurrency(symbol);
    };
    CurrencyRegistry.getAllBepTokens = function () {
        return allBepTokens;
    };
    CurrencyRegistry.getAllErc20Tokens = function () {
        return allErc20Tokens;
    };
    CurrencyRegistry.getAllTrc20Tokens = function () {
        return allTrc20Tokens;
    };
    CurrencyRegistry.getOneEosToken = function (contractAddress) {
        var symbol = [enums_1.TokenType.EOS, contractAddress].join('.');
        return CurrencyRegistry.getOneCurrency(symbol);
    };
    CurrencyRegistry.getAllEosTokens = function () {
        return allEosTokens;
    };
    CurrencyRegistry.getAllCurrencies = function () {
        return Array.from(allCurrencies.values());
    };
    CurrencyRegistry.hasOneCurrency = function (symbol) {
        return allCurrencies.has(symbol);
    };
    CurrencyRegistry.hasOneNativeCurrency = function (symbol) {
        return nativeCurrencies.map(function (c) { return c.symbol; }).indexOf(symbol) > -1;
    };
    CurrencyRegistry.getAllTerraTokens = function () {
        return allTerraTokens;
    };
    CurrencyRegistry.getAllCosmosTokens = function () {
        return allCosmosTokens;
    };
    CurrencyRegistry.getOneCurrency = function (symbol) {
        symbol = symbol.toLowerCase();
        if (!allCurrencies.has(symbol)) {
            throw new Error("CurrencyRegistry::getOneCurrency cannot find currency has symbol: " + symbol);
        }
        return allCurrencies.get(symbol);
    };
    CurrencyRegistry.getOneNativeCurrency = function (platform) {
        var symbol = platform.toLowerCase();
        if (!allCurrencies.has(symbol)) {
            throw new Error("CurrencyRegistry::getOneNativeCurrency cannot find currency has symbol: " + symbol);
        }
        return allCurrencies.get(symbol);
    };
    CurrencyRegistry.getCurrenciesOfPlatform = function (platform) {
        var result = [];
        switch (platform) {
            case enums_1.BlockchainPlatform.Bitcoin:
                result.push(Bitcoin);
                result.push.apply(result, CurrencyRegistry.getAllOmniAssets());
                break;
            case enums_1.BlockchainPlatform.Ethereum:
                result.push(Ethereum);
                result.push.apply(result, CurrencyRegistry.getAllErc20Tokens());
                break;
            case enums_1.BlockchainPlatform.Tomo:
                result.push(Tomo);
                result.push.apply(result, CurrencyRegistry.getAllTrc20Tokens());
                break;
            case enums_1.BlockchainPlatform.EOS:
                result.push.apply(result, CurrencyRegistry.getAllEosTokens());
                break;
            case enums_1.BlockchainPlatform.BitcoinCash:
                result.push(CurrencyRegistry.BitcoinCash);
                break;
            case enums_1.BlockchainPlatform.Litecoin:
                result.push(CurrencyRegistry.Litecoin);
                break;
            case enums_1.BlockchainPlatform.Dash:
                result.push(CurrencyRegistry.Dash);
                break;
            case enums_1.BlockchainPlatform.EthereumClassic:
                result.push(CurrencyRegistry.EthereumClasssic);
                break;
            case enums_1.BlockchainPlatform.Tomo:
                result.push(CurrencyRegistry.Tomo);
                break;
            case enums_1.BlockchainPlatform.Cardano:
                result.push(CurrencyRegistry.Cardano);
                break;
            case enums_1.BlockchainPlatform.Ripple:
                result.push(CurrencyRegistry.Ripple);
                break;
            case enums_1.BlockchainPlatform.Stellar:
                result.push(CurrencyRegistry.Stellar);
                break;
            case enums_1.BlockchainPlatform.Nem:
                result.push(CurrencyRegistry.Nem);
                break;
            case enums_1.BlockchainPlatform.Binance:
                result.push.apply(result, CurrencyRegistry.getAllBepTokens());
                break;
            case enums_1.BlockchainPlatform.Terra:
                result.push.apply(result, CurrencyRegistry.getAllTerraTokens());
                break;
            case enums_1.BlockchainPlatform.NEO:
                result.push(CurrencyRegistry.NEO);
                break;
            case enums_1.BlockchainPlatform.Cosmos:
                result.push.apply(result, CurrencyRegistry.getAllCosmosTokens());
                break;
            default:
                throw new Error("CurrencyRegistry::getCurrenciesOfPlatform hasn't been implemented for " + platform + " yet.");
        }
        return result;
    };
    CurrencyRegistry.setCurrencyConfig = function (c, config) {
        var symbol = c.symbol.toLowerCase();
        var finalConfig;
        if (allCurrencyConfigs.has(symbol)) {
            var oldConfig = allCurrencyConfigs.get(symbol);
            finalConfig = Object.assign({}, finalConfig, oldConfig);
        }
        finalConfig = Object.assign({}, finalConfig, config);
        logger.info("CurrencyRegistry::setCurrencyConfig: symbol=" + symbol + " endpoint=" + finalConfig.internalEndpoint);
        allCurrencyConfigs.set(symbol, finalConfig);
        onCurrencyConfigSetCallbacks.forEach(function (callback) { return callback(c, config); });
    };
    CurrencyRegistry.getCurrencyConfig = function (c) {
        var symbol = c.symbol.toLowerCase();
        var config = allCurrencyConfigs.get(symbol);
        if (!config) {
            config = allCurrencyConfigs.get(c.platform);
        }
        if (!config) {
            throw new Error("CurrencyRegistry::getCurrencyConfig cannot find currency has symbol: " + symbol);
        }
        return config;
    };
    CurrencyRegistry.onCurrencyRegistered = function (callback) {
        onCurrencyRegisteredCallbacks.push(callback);
    };
    CurrencyRegistry.onSpecificCurrencyRegistered = function (currency, callback) {
        var symbol = currency.symbol.toLowerCase();
        if (allCurrencies.has(symbol)) {
            callback();
            return;
        }
        if (!onSpecificCurrencyRegisteredCallbacks.has(symbol)) {
            onSpecificCurrencyRegisteredCallbacks.set(symbol, []);
        }
        onSpecificCurrencyRegisteredCallbacks.get(symbol).push(callback);
    };
    CurrencyRegistry.onERC20TokenRegistered = function (callback) {
        if (allErc20Tokens.length > 0) {
            allErc20Tokens.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['erc20-registered'].push(callback);
    };
    CurrencyRegistry.onTRC20TokenRegistered = function (callback) {
        if (allTrc20Tokens.length > 0) {
            allTrc20Tokens.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['trc20-registered'].push(callback);
    };
    CurrencyRegistry.onOmniAssetRegistered = function (callback) {
        if (allOmniAssets.length > 0) {
            allOmniAssets.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['omni-registered'].push(callback);
    };
    CurrencyRegistry.onEOSTokenRegistered = function (callback) {
        if (allEosTokens.length > 0) {
            allEosTokens.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['eos-token-registered'].push(callback);
    };
    CurrencyRegistry.onBepTokenRegistered = function (callback) {
        if (allBepTokens.length) {
            allBepTokens.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['bep-token-registered'].push(callback);
    };
    CurrencyRegistry.onTerraTokenRegistered = function (callback) {
        if (allTerraTokens.length) {
            allTerraTokens.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['terra-token-registered'].push(callback);
    };
    CurrencyRegistry.onCosmosTokenRegistered = function (callback) {
        if (allCosmosTokens.length) {
            allCosmosTokens.forEach(function (token) {
                callback(token);
            });
        }
        eventCallbacks['cosmos-token-registered'].push(callback);
    };
    CurrencyRegistry.onCurrencyConfigSet = function (callback) {
        onCurrencyConfigSetCallbacks.push(callback);
    };
    CurrencyRegistry.unregisterCurrency = function (symbol) {
        if (!allCurrencies.has(symbol)) {
            logger.error("Try to unregister an invalid currency symbol=" + symbol);
            return false;
        }
        return allCurrencies.delete(symbol);
    };
    CurrencyRegistry.Bitcoin = Bitcoin;
    CurrencyRegistry.Ethereum = Ethereum;
    CurrencyRegistry.Cardano = Cardano;
    CurrencyRegistry.BitcoinCash = BitcoinCash;
    CurrencyRegistry.BitcoinSV = BitcoinSV;
    CurrencyRegistry.EOS = EOS;
    CurrencyRegistry.Litecoin = Litecoin;
    CurrencyRegistry.Dash = Dash;
    CurrencyRegistry.EthereumClasssic = EthereumClasssic;
    CurrencyRegistry.NEO = NEO;
    CurrencyRegistry.NEOGAS = NEOGAS;
    CurrencyRegistry.Tomo = Tomo;
    CurrencyRegistry.Ripple = Ripple;
    CurrencyRegistry.Stellar = Stellar;
    CurrencyRegistry.Nem = Nem;
    CurrencyRegistry.Tron = Tron;
    CurrencyRegistry.Binance = Binance;
    CurrencyRegistry.Terra = Terra;
    CurrencyRegistry.Cosmos = Cosmos;
    return CurrencyRegistry;
}());
exports.CurrencyRegistry = CurrencyRegistry;
process.nextTick(function () {
    nativeCurrencies.forEach(function (c) { return CurrencyRegistry.registerCurrency(c); });
});
exports.default = CurrencyRegistry;
//# sourceMappingURL=CurrencyRegistry.js.map