"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosBasedGateway = void 0;
var _ = __importStar(require("lodash"));
var axios_1 = __importDefault(require("axios"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var enums_1 = require("./enums");
var types_1 = require("./types");
var Utils = __importStar(require("./Utils"));
var Logger_1 = require("./Logger");
var BaseGateway_1 = __importDefault(require("./BaseGateway"));
var logger = Logger_1.getLogger('CosmosBasedGateway');
var _cacheBlockNumber = {
    value: 0,
    updatedAt: 0,
    isRequesting: false,
};
var UrlRestApi = {
    getBlockCount: "/blocks/latest",
    getBlockNumber: "/blocks",
    getOneTransaction: '/txs',
    getAllBlockTransactions: '/txs?limit=1000&tx.height=',
    postOneTransaction: '/txs',
    getFeeAndGas: '/txs/estimate_fee',
    getBalance: '/bank/balances',
    getAccount: '/auth/accounts',
};
var CosmosBasedGateway = (function (_super) {
    __extends(CosmosBasedGateway, _super);
    function CosmosBasedGateway(currency, url) {
        var _this = _super.call(this, currency) || this;
        var config = _this.getCurrencyConfig();
        _this._appClient = config.restEndpoint;
        if (url) {
            _this._url = url;
        }
        else {
            _this._url = UrlRestApi;
        }
        return _this;
    }
    CosmosBasedGateway.prototype.getAccount = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, axios_1.default.get("" + this._appClient + this._url.getAccount + "/" + address)];
                    case 1:
                        res = _a.sent();
                        return [2, res.data];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.getBlockCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, CACHE_TIME, blockHeight, response, err_1, newUpdateAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = Utils.nowInMillis();
                        CACHE_TIME = 10000;
                        if (_cacheBlockNumber.value > 0 && now - _cacheBlockNumber.updatedAt < CACHE_TIME) {
                            return [2, _cacheBlockNumber.value];
                        }
                        if (!_cacheBlockNumber.isRequesting) return [3, 2];
                        return [4, Utils.timeout(500)];
                    case 1:
                        _a.sent();
                        return [2, this.getBlockCount()];
                    case 2:
                        _cacheBlockNumber.isRequesting = true;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, axios_1.default.get("" + this._appClient + this._url.getBlockCount)];
                    case 4:
                        response = _a.sent();
                        blockHeight = response.data.block_meta.header.height;
                        return [3, 6];
                    case 5:
                        err_1 = _a.sent();
                        logger.error(err_1);
                        blockHeight = _cacheBlockNumber.value;
                        return [3, 6];
                    case 6:
                        newUpdateAt = Utils.nowInMillis();
                        _cacheBlockNumber.value = blockHeight;
                        _cacheBlockNumber.updatedAt = newUpdateAt;
                        _cacheBlockNumber.isRequesting = false;
                        logger.debug("CosmosBasedGateway::getBlockCount value=" + blockHeight + " updateAt=" + newUpdateAt);
                        return [2, blockHeight];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.getBlockTransactions = function (blockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var res, transactions_1, data, txs, blockInfo, latestBlock_1, blockHeader_1, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4, axios_1.default.get("" + this._appClient + this._url.getAllBlockTransactions + blockHeight)];
                    case 1:
                        res = _a.sent();
                        transactions_1 = new types_1.GenericTransactions();
                        data = res.data;
                        if (!data) {
                            throw new Error("Request fail");
                        }
                        txs = data.txs;
                        if (!txs || !txs.length) {
                            return [2, transactions_1];
                        }
                        return [4, this.getOneBlock(blockHeight)];
                    case 2:
                        blockInfo = (_a.sent());
                        return [4, this.getBlockCount()];
                    case 3:
                        latestBlock_1 = _a.sent();
                        blockHeader_1 = new types_1.BlockHeader({
                            hash: blockInfo.hash,
                            number: blockInfo.number,
                            timestamp: blockInfo.timestamp,
                        });
                        _.map(txs, function (tx) {
                            var rawTx = _this.getCosmosRawTx(tx);
                            var _transaction = _this._convertRawToCosmosTransactions(rawTx, blockHeader_1, latestBlock_1);
                            transactions_1.push(_transaction);
                        });
                        return [2, transactions_1];
                    case 4:
                        err_2 = _a.sent();
                        throw err_2;
                    case 5: return [2];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.sendRawTransaction = function (rawTx, retryCount) {
        return __awaiter(this, void 0, void 0, function () {
            var txBroadcast, res, receipt, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!retryCount || isNaN(retryCount)) {
                            retryCount = 0;
                        }
                        txBroadcast = rawTx;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, axios_1.default.post("" + this._appClient + this._url.postOneTransaction, txBroadcast)];
                    case 2:
                        res = _a.sent();
                        receipt = res.data;
                        if (receipt.height === '0') {
                            throw new Error(receipt.raw_log);
                        }
                        return [2, { txid: receipt.txhash }];
                    case 3:
                        err_3 = _a.sent();
                        if (retryCount + 1 > 5) {
                            logger.error("Too many fails sending tx");
                            throw err_3;
                        }
                        return [2, this.sendRawTransaction(rawTx, retryCount + 1)];
                    case 4: return [2];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.getAddressBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var res, balance, currencyBalance, err_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, axios_1.default.get("" + this._appClient + this._url.getBalance + "/" + address)];
                    case 1:
                        res = _a.sent();
                        balance = res.data;
                        if (!balance) {
                            return [2, new bignumber_js_1.default(0)];
                        }
                        currencyBalance = balance.result.find(function (_balance) { return _balance.denom === _this.getCode(); });
                        if (!currencyBalance || !currencyBalance.amount) {
                            return [2, new bignumber_js_1.default(0)];
                        }
                        return [2, new bignumber_js_1.default(currencyBalance.amount)];
                    case 2:
                        err_4 = _a.sent();
                        throw err_4;
                    case 3: return [2];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.etimateFee = function (rawTx) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, axios_1.default.post("" + this._appClient + this._url.getFeeAndGas, { estimate_req: rawTx })];
                    case 1:
                        res = _a.sent();
                        return [2, res.data];
                    case 2:
                        e_1 = _a.sent();
                        throw e_1;
                    case 3: return [2];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.getTransactionStatus = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var txStatus, response, tx, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getOneTransaction(txid)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            txStatus = enums_1.TransactionStatus.FAILED;
                        }
                        else {
                            tx = response;
                            if (new bignumber_js_1.default(tx.block.number).gte(this.getCurrencyConfig().requiredConfirmations)) {
                                txStatus = enums_1.TransactionStatus.COMPLETED;
                            }
                            else {
                                txStatus = enums_1.TransactionStatus.CONFIRMING;
                            }
                        }
                        return [3, 3];
                    case 2:
                        err_5 = _a.sent();
                        txStatus = enums_1.TransactionStatus.UNKNOWN;
                        return [3, 3];
                    case 3: return [2, txStatus];
                }
            });
        });
    };
    CosmosBasedGateway.prototype.getAverageSeedingFee = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('TODO: Implement me');
            });
        });
    };
    CosmosBasedGateway.prototype._getOneTransaction = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var res, result, blockInfo, latestBlock, blockHeader, rawTx, txFee, transactions, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4, axios_1.default.get("" + this._appClient + this._url.getOneTransaction + "/" + txid)];
                    case 1:
                        res = _a.sent();
                        result = res.data;
                        return [4, this.getOneBlock(new bignumber_js_1.default(result.height).toNumber())];
                    case 2:
                        blockInfo = _a.sent();
                        return [4, this.getBlockCount()];
                    case 3:
                        latestBlock = _a.sent();
                        blockHeader = new types_1.BlockHeader({
                            hash: blockInfo.hash,
                            number: blockInfo.number,
                            timestamp: blockInfo.timestamp,
                        });
                        rawTx = this.getCosmosRawTx(result);
                        return [4, this.getFeeTx(rawTx)];
                    case 4:
                        txFee = _a.sent();
                        transactions = this._convertRawToCosmosTransactions(rawTx, blockHeader, latestBlock, txFee);
                        return [2, transactions];
                    case 5:
                        err_6 = _a.sent();
                        throw err_6;
                    case 6: return [2];
                }
            });
        });
    };
    CosmosBasedGateway.prototype._getOneBlock = function (blockHash) {
        return __awaiter(this, void 0, void 0, function () {
            var response, block, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, axios_1.default.get("" + this._appClient + this._url.getBlockNumber + "/" + blockHash)];
                    case 1:
                        response = _a.sent();
                        block = this.convertCosmosBlock(response.data);
                        return [2, block];
                    case 2:
                        err_7 = _a.sent();
                        throw err_7;
                    case 3: return [2];
                }
            });
        });
    };
    return CosmosBasedGateway;
}(BaseGateway_1.default));
exports.CosmosBasedGateway = CosmosBasedGateway;
exports.default = CosmosBasedGateway;
//# sourceMappingURL=CosmosBasedGateway.js.map