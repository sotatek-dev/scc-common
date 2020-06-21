"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var lru_cache_1 = __importDefault(require("lru-cache"));
var util_1 = __importDefault(require("util"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var Utils = __importStar(require("./Utils"));
var Utils_1 = require("./Utils");
var RPCClient_1 = __importDefault(require("./RPCClient"));
var Logger_1 = require("./Logger");
var types_1 = require("./types");
var CurrencyRegistry_1 = __importDefault(require("./registries/CurrencyRegistry"));
var GatewayRegistry_1 = __importDefault(require("./registries/GatewayRegistry"));
var p_limit_1 = __importDefault(require("p-limit"));
var hdkey_1 = __importDefault(require("hdkey"));
var bip39_1 = __importDefault(require("bip39"));
var AccountHdWallet_1 = __importDefault(require("./types/AccountHdWallet"));
CurrencyRegistry_1.default.onCurrencyConfigSet(function (currency, config) {
    var gateway = GatewayRegistry_1.default.getGatewayInstance(currency);
    if (gateway) {
        process.nextTick(function () {
            gateway.loadCurrencyConfig();
        });
    }
});
var logger = Logger_1.getLogger('BaseGateway');
var BaseGateway = (function () {
    function BaseGateway(currency) {
        this._cacheBlock = new lru_cache_1.default(this._getCacheOptions());
        this._cacheTxByHash = new lru_cache_1.default(this._getCacheOptions());
        this._currency = currency;
    }
    BaseGateway.prototype.getCurrency = function () {
        return this._currency;
    };
    BaseGateway.prototype.getCurrencyConfig = function () {
        var config = CurrencyRegistry_1.default.getCurrencyConfig(this._currency);
        if (!config) {
            var platformCurrency = CurrencyRegistry_1.default.getOneCurrency(this._currency.platform);
            config = CurrencyRegistry_1.default.getCurrencyConfig(platformCurrency);
        }
        return config;
    };
    BaseGateway.prototype.loadCurrencyConfig = function () {
        var rpcRawConfig = CurrencyRegistry_1.default.getCurrencyConfig(this._currency).rpcEndpoint;
        if (rpcRawConfig) {
            try {
                var rpcConfig = JSON.parse(rpcRawConfig);
                this._rpcClient = new RPCClient_1.default(rpcConfig);
            }
            catch (e) {
                logger.error("BaseGateway::constructor could not contruct RPC Client due to error: " + util_1.default.inspect(e));
            }
        }
    };
    BaseGateway.prototype.createAccountHdWalletAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var privateKey, address, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.generatePrivateKeyHdWalletAsync(params)];
                    case 1:
                        privateKey = _a.sent();
                        return [4, this.getAccountFromPrivateKey(privateKey)];
                    case 2:
                        address = _a.sent();
                        path = params.path ? params.path : this._currency.hdPath;
                        return [2, new AccountHdWallet_1.default(privateKey, address.address, path + params.accountIndex.toString())];
                }
            });
        });
    };
    BaseGateway.prototype.generatePrivateKeyHdWalletAsync = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var path, seed, index, root, addrnode, privateKey;
            return __generator(this, function (_a) {
                path = params.path ? params.path : this._currency.hdPath;
                if (!path) {
                    throw new Error("The curreny's hd path has set up");
                }
                seed = params.seed;
                index = params.accountIndex;
                if (!seed || (index === null || typeof index === 'undefined')) {
                    throw new Error("Need seed and accountIndex to create addresses");
                }
                root = hdkey_1.default.fromMasterSeed(Buffer.from(seed));
                addrnode = root.derive(path + index.toString());
                privateKey = addrnode.privateKey.toString('hex');
                return [2, privateKey];
            });
        });
    };
    BaseGateway.prototype.generateSeed = function () {
        return bip39_1.default.generateMnemonic();
    };
    BaseGateway.prototype.isValidAddressAsync = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, true];
            });
        });
    };
    BaseGateway.prototype.isNeedTagAsync = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, false];
            });
        });
    };
    BaseGateway.prototype.getNetworkStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, [{ isOK: true }]];
            });
        });
    };
    BaseGateway.prototype.normalizeAddress = function (address) {
        return address;
    };
    BaseGateway.prototype.getOneTransaction = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, lastNetworkBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = this._cacheTxByHash.get(txid);
                        if (!!tx) return [3, 2];
                        return [4, this._getOneTransaction(txid)];
                    case 1:
                        tx = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!tx) {
                            return [2, null];
                        }
                        return [4, this.getBlockCount()];
                    case 3:
                        lastNetworkBlock = _a.sent();
                        tx.confirmations = lastNetworkBlock - tx.block.number + 1;
                        this._cacheTxByHash.set(txid, tx);
                        return [2, tx];
                }
            });
        });
    };
    BaseGateway.prototype.getParallelNetworkRequestLimit = function () {
        return 5;
    };
    BaseGateway.prototype.getTransactionsByIds = function (txids) {
        return __awaiter(this, void 0, void 0, function () {
            var result, getOneTx, limit;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new types_1.Transactions();
                        if (!txids || !txids.length) {
                            return [2, result];
                        }
                        getOneTx = function (txid) { return __awaiter(_this, void 0, void 0, function () {
                            var tx;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, this.getOneTransaction(txid)];
                                    case 1:
                                        tx = _a.sent();
                                        if (tx) {
                                            result.push(tx);
                                        }
                                        return [2];
                                }
                            });
                        }); };
                        limit = p_limit_1.default(this.getParallelNetworkRequestLimit());
                        return [4, Utils.PromiseAll(txids.map(function (txid) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2, limit(function () { return getOneTx(txid); })];
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    BaseGateway.prototype.getOneBlock = function (blockHash) {
        return __awaiter(this, void 0, void 0, function () {
            var cachedBlock, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cachedBlock = this._cacheBlock.get(blockHash);
                        if (cachedBlock) {
                            return [2, cachedBlock];
                        }
                        return [4, this._getOneBlock(blockHash)];
                    case 1:
                        block = _a.sent();
                        this._cacheBlock.set(blockHash, block);
                        return [2, block];
                }
            });
        });
    };
    BaseGateway.prototype.getMultiBlocksTransactions = function (fromBlockNumber, toBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var count, blockNumbers, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (fromBlockNumber > toBlockNumber) {
                            throw new Error("fromBlockNumber must be less than toBlockNumber");
                        }
                        count = toBlockNumber - fromBlockNumber + 1;
                        blockNumbers = Array.from(new Array(count), function (val, index) { return index + fromBlockNumber; });
                        result = new types_1.Transactions();
                        return [4, Promise.all(blockNumbers.map(function (blockNumber) { return __awaiter(_this, void 0, void 0, function () {
                                var txs, transactions;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, this.getBlockTransactions(blockNumber)];
                                        case 1:
                                            txs = _a.sent();
                                            transactions = lodash_1.default.compact(txs);
                                            result.push.apply(result, transactions);
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, result];
                }
            });
        });
    };
    BaseGateway.prototype.getBlockTransactions = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var block, txs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getOneBlock(blockNumber)];
                    case 1:
                        block = _a.sent();
                        if (!block) {
                            throw new Error("Could not get information of block: " + blockNumber);
                        }
                        return [4, this.getTransactionsByIds(lodash_1.default.compact(block.txids))];
                    case 2:
                        txs = _a.sent();
                        return [2, txs];
                }
            });
        });
    };
    BaseGateway.prototype.estimateFee = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new bignumber_js_1.default(0)];
            });
        });
    };
    BaseGateway.prototype._getCacheOptions = function () {
        return {
            max: 1024,
            maxAge: 1000 * 60 * 5,
        };
    };
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", String)
    ], BaseGateway.prototype, "normalizeAddress", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseGateway.prototype, "getOneTransaction", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BaseGateway.prototype, "getTransactionsByIds", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseGateway.prototype, "getOneBlock", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number]),
        __metadata("design:returntype", Promise)
    ], BaseGateway.prototype, "getMultiBlocksTransactions", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseGateway.prototype, "getBlockTransactions", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BaseGateway.prototype, "_getCacheOptions", null);
    return BaseGateway;
}());
exports.BaseGateway = BaseGateway;
exports.default = BaseGateway;
//# sourceMappingURL=BaseGateway.js.map