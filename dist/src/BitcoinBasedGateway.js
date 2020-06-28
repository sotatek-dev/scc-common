"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var axios_1 = __importDefault(require("axios"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var Utils_1 = require("./Utils");
var Logger_1 = require("./Logger");
var Block_1 = require("./types/Block");
var UTXOBasedGateway_1 = require("./UTXOBasedGateway");
var TransactionStatus_1 = require("./enums/TransactionStatus");
var BitcoinBasedTransaction_1 = require("./types/BitcoinBasedTransaction");
var BitcoinBasedTransactions_1 = require("./types/BitcoinBasedTransactions");
var lru_cache_1 = __importDefault(require("lru-cache"));
var registries_1 = require("./registries");
var p_limit_1 = __importDefault(require("p-limit"));
var RedisChannel_1 = require("../src/RedisChannel");
var limit = p_limit_1.default(1);
var INSIGHT_REQUEST_MAX_RETRIES = 10;
var logger = Logger_1.getLogger('BitcoinBasedGateway');
var _cacheRawTxByBlockUrl = new lru_cache_1.default({
    max: 1024,
    maxAge: 1000 * 60 * 5,
});
var BitcoinBasedGateway = (function (_super) {
    __extends(BitcoinBasedGateway, _super);
    function BitcoinBasedGateway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BitcoinBasedGateway.convertInsightUtxoToBitcoreUtxo = function (utxos) {
        return utxos.map(function (utxo) { return ({
            address: utxo.address,
            txId: utxo.txid,
            outputIndex: utxo.vout,
            script: utxo.scriptPubKey,
            satoshis: utxo.satoshis,
        }); });
    };
    BitcoinBasedGateway.prototype.isValidAddressAsync = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var bitcore, network;
            return __generator(this, function (_a) {
                bitcore = this.getBitCoreLib();
                network = registries_1.EnvConfigRegistry.isMainnet() ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
                try {
                    return [2, bitcore.Address.isValid(address, network)];
                }
                catch (e) {
                    logger.error("Could not validate address " + address + " due to error: ", e);
                }
                return [2, false];
            });
        });
    };
    BitcoinBasedGateway.prototype.createAccountAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bitcore, network, privateKey, wif, address;
            return __generator(this, function (_a) {
                bitcore = this.getBitCoreLib();
                network = registries_1.EnvConfigRegistry.isMainnet() ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
                privateKey = new bitcore.PrivateKey(null, network);
                wif = privateKey.toWIF();
                address = privateKey.toAddress();
                return [2, {
                        address: address.toString(),
                        privateKey: wif,
                    }];
            });
        });
    };
    BitcoinBasedGateway.prototype.getAccountFromPrivateKey = function (rawPrivateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var bitcore, network, privateKey, address;
            return __generator(this, function (_a) {
                bitcore = this.getBitCoreLib();
                network = registries_1.EnvConfigRegistry.isMainnet() ? bitcore.Networks.mainnet : bitcore.Networks.testnet;
                privateKey = new bitcore.PrivateKey(rawPrivateKey, network);
                address = privateKey.toAddress().toString();
                return [2, { address: address, privateKey: privateKey.toWIF() }];
            });
        });
    };
    BitcoinBasedGateway.prototype.constructRawTransaction = function (fromAddresses, vouts) {
        return __awaiter(this, void 0, void 0, function () {
            var pickedUtxos, allUtxos, totalOutputAmount, totalInputAmount, esitmatedFee, estimatedTxSize, isSufficientBalance, _i, allUtxos_1, utxo, _a, _b, errMsg;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (typeof fromAddresses === 'string') {
                            fromAddresses = [fromAddresses];
                        }
                        pickedUtxos = [];
                        return [4, this.getMultiAddressesUtxos(fromAddresses)];
                    case 1:
                        allUtxos = _c.sent();
                        totalOutputAmount = vouts.reduce(function (memo, vout) {
                            return memo.plus(vout.amount);
                        }, new bignumber_js_1.default(0));
                        totalInputAmount = new bignumber_js_1.default(0);
                        esitmatedFee = new bignumber_js_1.default(0);
                        estimatedTxSize = vouts.length * 34 + 10;
                        isSufficientBalance = false;
                        _i = 0, allUtxos_1 = allUtxos;
                        _c.label = 2;
                    case 2:
                        if (!(_i < allUtxos_1.length)) return [3, 5];
                        utxo = allUtxos_1[_i];
                        pickedUtxos.push(utxo);
                        totalInputAmount = totalInputAmount.plus(utxo.satoshis);
                        estimatedTxSize += 181;
                        _a = bignumber_js_1.default.bind;
                        _b = estimatedTxSize;
                        return [4, this.getFeeInSatoshisPerByte()];
                    case 3:
                        esitmatedFee = new (_a.apply(bignumber_js_1.default, [void 0, _b * (_c.sent())]))();
                        if (totalInputAmount.gt(new bignumber_js_1.default(totalOutputAmount.plus(esitmatedFee)))) {
                            isSufficientBalance = true;
                            return [3, 5];
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5:
                        if (!isSufficientBalance) {
                            errMsg = 'Could not construct tx because of in sufficient balance:' +
                                (" addresses=[" + fromAddresses + "]") +
                                (" total balance=" + totalInputAmount.toFixed()) +
                                (" total output=" + totalOutputAmount.toFixed()) +
                                (" estimatedFee=" + esitmatedFee.toFixed());
                            throw new Error(errMsg);
                        }
                        return [2, this._constructRawTransaction(pickedUtxos, vouts, esitmatedFee)];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.constructRawConsolidateTransaction = function (pickedUtxos, toAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var totalInputAmount, estimatedTxSize, estimatedFee, _a, _b, vout;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        totalInputAmount = pickedUtxos.reduce(function (memo, utxo) {
                            return memo.plus(new bignumber_js_1.default(utxo.satoshis));
                        }, new bignumber_js_1.default(0));
                        estimatedTxSize = pickedUtxos.length * 181 + 34 + 10;
                        _a = bignumber_js_1.default.bind;
                        _b = estimatedTxSize;
                        return [4, this.getFeeInSatoshisPerByte()];
                    case 1:
                        estimatedFee = new (_a.apply(bignumber_js_1.default, [void 0, _b * (_c.sent())]))();
                        vout = {
                            toAddress: toAddress,
                            amount: totalInputAmount.minus(estimatedFee),
                        };
                        return [2, this._constructRawTransaction(pickedUtxos, [vout], estimatedFee)];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.signRawTransaction = function (unsignedRaw, privateKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, txid, signedRaw;
            return __generator(this, function (_a) {
                if (typeof privateKeys === 'string') {
                    privateKeys = [privateKeys];
                }
                try {
                    tx = new (this.getBitCoreLib()).Transaction(JSON.parse(unsignedRaw));
                }
                catch (e) {
                    throw new Error("Couldn't sign raw tx because of wrong unsignedRaw");
                }
                try {
                    privateKeys.forEach(function (privateKey) {
                        tx.sign(privateKey);
                    });
                }
                catch (e) {
                    logger.error("Could not sign btc-based tx due to error: ", e);
                    throw new Error("Couldn't sign raw tx because of wrong privateKey");
                }
                txid = tx.hash;
                signedRaw = tx.serialize({
                    disableDustOutputs: true,
                });
                return [2, {
                        txid: txid,
                        signedRaw: signedRaw,
                        unsignedRaw: unsignedRaw,
                    }];
            });
        });
    };
    BitcoinBasedGateway.prototype.sendRawTransaction = function (signedRawTx) {
        return __awaiter(this, void 0, void 0, function () {
            var txid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._rpcClient.call('sendrawtransaction', [signedRawTx, false])];
                    case 1:
                        txid = _a.sent();
                        return [2, { txid: txid }];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.reconstructRawTx = function (rawTx) {
        var bitcore = this.getBitCoreLib();
        var tx = new bitcore.Transaction(JSON.parse(rawTx));
        var unsignedRaw = JSON.stringify(tx.toObject());
        return {
            txid: tx.hash,
            unsignedRaw: unsignedRaw,
        };
    };
    BitcoinBasedGateway.prototype.getBlockCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._rpcClient.call('getblockcount')];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getAddressBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var apiEndpoint, response, e_1, errMsg, addressInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiEndpoint = this.getInsightAPIEndpoint();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, axios_1.default.get(apiEndpoint + "/addr/" + address + "/?noTxList=1")];
                    case 2:
                        response = _a.sent();
                        return [3, 4];
                    case 3:
                        e_1 = _a.sent();
                        errMsg = '';
                        if (e_1.response) {
                            errMsg += " status=" + e_1.response.status + " response=" + JSON.stringify(e_1.response.data);
                        }
                        else if (e_1.request) {
                            errMsg += " no response was received";
                        }
                        throw new Error("Could not get balance of address=" + address + " error=" + e_1.toString() + " info=" + errMsg);
                    case 4:
                        addressInfo = response.data;
                        return [2, new bignumber_js_1.default(addressInfo.balanceSat)];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getTransactionStatus = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, requiredConfirmations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getOneTransaction(txid)];
                    case 1:
                        tx = _a.sent();
                        if (!tx) {
                            return [2, TransactionStatus_1.TransactionStatus.UNKNOWN];
                        }
                        requiredConfirmations = this.getCurrencyConfig().requiredConfirmations;
                        if (tx.confirmations >= requiredConfirmations) {
                            return [2, TransactionStatus_1.TransactionStatus.COMPLETED];
                        }
                        return [2, TransactionStatus_1.TransactionStatus.CONFIRMING];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getOneAddressUtxos = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var apiEndpoint, response, e_2, utxos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiEndpoint = this.getInsightAPIEndpoint();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, axios_1.default.get(apiEndpoint + "/addr/" + address + "/utxo")];
                    case 2:
                        response = _a.sent();
                        return [3, 4];
                    case 3:
                        e_2 = _a.sent();
                        logger.error("Could not got get utxos of address=" + address + " due to error: ", e_2);
                        throw new Error("Could got get utxos of address=" + address + "...");
                    case 4:
                        utxos = response.data;
                        return [2, utxos
                                .sort(function (a, b) { return b.confirmations - a.confirmations; })
                                .map(function (utxo) {
                                utxo.value = utxo.amount;
                                return utxo;
                            })];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getMultiAddressesUtxos = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, addresses_1, address, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = [];
                        _i = 0, addresses_1 = addresses;
                        _d.label = 1;
                    case 1:
                        if (!(_i < addresses_1.length)) return [3, 4];
                        address = addresses_1[_i];
                        _b = (_a = result.push).apply;
                        _c = [result];
                        return [4, this.getOneAddressUtxos(address)];
                    case 2:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, result];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getOneTxVouts = function (txid, address) {
        return __awaiter(this, void 0, void 0, function () {
            var apiEndpoint, response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiEndpoint = this.getInsightAPIEndpoint();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, axios_1.default.get(apiEndpoint + "/tx/" + txid)];
                    case 2:
                        response = _a.sent();
                        return [3, 4];
                    case 3:
                        e_3 = _a.sent();
                        throw e_3;
                    case 4: return [2, response.data.vout.filter(function (vout) {
                            if (!address) {
                                return true;
                            }
                            if (!vout.scriptPubKey || !vout.scriptPubKey.addresses || !vout.scriptPubKey.addresses.length) {
                                return false;
                            }
                            return vout.scriptPubKey.addresses.indexOf(address) > -1;
                        })];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getMultiTxsVouts = function (txids, address) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _i, txids_1, txid, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = [];
                        _i = 0, txids_1 = txids;
                        _d.label = 1;
                    case 1:
                        if (!(_i < txids_1.length)) return [3, 4];
                        txid = txids_1[_i];
                        _b = (_a = result.push).apply;
                        _c = [result];
                        return [4, this.getOneTxVouts(txid, address)];
                    case 2:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, result];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getBlockTransactions = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var block, endpoint, listTxs, txsUrl, response, retryCount, e_4, errMsg, pageTotal, networkBlockCount, pages;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getOneBlock(blockNumber)];
                    case 1:
                        block = _a.sent();
                        endpoint = this.getInsightAPIEndpoint();
                        listTxs = new BitcoinBasedTransactions_1.BitcoinBasedTransactions();
                        txsUrl = endpoint + "/txs?block=" + blockNumber;
                        retryCount = 0;
                        _a.label = 2;
                    case 2:
                        if (!true) return [3, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, axios_1.default.get(txsUrl)];
                    case 4:
                        response = _a.sent();
                        return [3, 7];
                    case 5:
                        e_4 = _a.sent();
                        errMsg = "Could not get txs of block=" + blockNumber + " fetching url=" + txsUrl + " err=" + e_4.toString();
                        if (e_4.response) {
                            errMsg += " response=" + JSON.stringify(e_4.response.data) + " status=" + e_4.response.status + " retryCount=" + retryCount;
                        }
                        logger.error(errMsg, e_4);
                        if (++retryCount === INSIGHT_REQUEST_MAX_RETRIES) {
                            throw new Error("Could not get txs of block=" + blockNumber + " endpoint=" + endpoint);
                        }
                        return [3, 6];
                    case 6: return [3, 2];
                    case 7:
                        pageTotal = response.data.pagesTotal;
                        return [4, this.getBlockCount()];
                    case 8:
                        networkBlockCount = _a.sent();
                        pages = Array.from(new Array(pageTotal), function (val, index) { return index; });
                        return [4, Promise.all(pages.map(function (page) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    return [2, limit(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var txs;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, this._fetchOneBlockTxsInsightPage(block, page, pageTotal, networkBlockCount)];
                                                    case 1:
                                                        txs = _a.sent();
                                                        listTxs.push.apply(listTxs, txs);
                                                        return [2];
                                                }
                                            });
                                        }); })];
                                });
                            }); }))];
                    case 9:
                        _a.sent();
                        return [2, listTxs];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.estimateFee = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var estimatedTxSize, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        estimatedTxSize = options.totalInputs * 181 + 34 + 10;
                        _a = bignumber_js_1.default.bind;
                        _b = estimatedTxSize;
                        return [4, this.getFeeInSatoshisPerByte()];
                    case 1: return [2, new (_a.apply(bignumber_js_1.default, [void 0, _b * (_c.sent())]))()];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype.getInsightAPIEndpoint = function () {
        return this.getCurrencyConfig().restEndpoint;
    };
    BitcoinBasedGateway.prototype.getFeeInSatoshisPerByte = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, 15];
            });
        });
    };
    BitcoinBasedGateway.prototype.getParallelNetworkRequestLimit = function () {
        return 5;
    };
    BitcoinBasedGateway.prototype._fetchOneBlockTxsInsightPage = function (block, page, pageTotal, networkBlockCount) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, currency, blockNumber, confirmations, pageResponse, retryCount, data, gwName, url, key, redisClient, cachedData, e_5, errMsg, txs, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.getInsightAPIEndpoint();
                        currency = this.getCurrency();
                        blockNumber = block.number;
                        confirmations = 0;
                        retryCount = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3, 9];
                        gwName = this.constructor.name;
                        url = endpoint + "/txs?block=" + blockNumber + "&pageNum=" + page;
                        logger.debug(gwName + "::getBlockTransactions block=" + blockNumber + " pageNum=" + (page + 1) + "/" + pageTotal);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        key = this.getCurrency().symbol + url;
                        redisClient = void 0;
                        cachedData = void 0;
                        if (!!!registries_1.EnvConfigRegistry.isUsingRedis()) return [3, 4];
                        redisClient = RedisChannel_1.getRedisClient();
                        return [4, redisClient.get(key)];
                    case 3:
                        cachedData = _a.sent();
                        return [3, 5];
                    case 4:
                        cachedData = JSON.stringify(_cacheRawTxByBlockUrl.get(key));
                        _a.label = 5;
                    case 5:
                        if (!!cachedData) {
                            data = JSON.parse(cachedData);
                            confirmations = networkBlockCount - blockNumber + 1;
                            return [3, 9];
                        }
                        return [4, axios_1.default.get(url)];
                    case 6:
                        pageResponse = _a.sent();
                        data = pageResponse.data;
                        if (redisClient) {
                            redisClient.setex(key, 300, JSON.stringify(pageResponse.data));
                        }
                        else {
                            _cacheRawTxByBlockUrl.set(key, data);
                        }
                        return [3, 9];
                    case 7:
                        e_5 = _a.sent();
                        errMsg = "Could not get txs of block=" + blockNumber + " page=" + page + " fetching url=" + url + " err=" + e_5.toString();
                        if (e_5.response) {
                            errMsg += " response=" + JSON.stringify(e_5.response.data) + " status=" + e_5.response.status + " retryCount=" + retryCount;
                        }
                        if (++retryCount === INSIGHT_REQUEST_MAX_RETRIES) {
                            logger.error("Too many fails: " + errMsg + " ", e_5);
                            throw new Error(errMsg);
                        }
                        else {
                            logger.error(errMsg, e_5);
                        }
                        return [3, 8];
                    case 8: return [3, 1];
                    case 9:
                        txs = data.txs;
                        result = txs.map(function (tx) {
                            var isOmniTx = tx.vout.some(function (vout) {
                                return vout.scriptPubKey.asm.startsWith('OP_RETURN 6f6d6e69');
                            });
                            if (isOmniTx) {
                                return null;
                            }
                            if (confirmations > 0) {
                                tx.confirmations = confirmations;
                            }
                            return new BitcoinBasedTransaction_1.BitcoinBasedTransaction(currency, tx, block);
                        });
                        return [2, lodash_1.default.compact(result)];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype._constructRawTransaction = function (pickedUtxos, vouts, esitmatedFee) {
        var tx;
        var totalInput = pickedUtxos.reduce(function (memo, utxo) {
            return memo.plus(new bignumber_js_1.default(utxo.satoshis));
        }, new bignumber_js_1.default(0));
        var totalOutput = vouts.reduce(function (memo, vout) {
            return memo.plus(vout.amount);
        }, new bignumber_js_1.default(0));
        if (totalInput.lt(totalOutput.plus(esitmatedFee))) {
            throw new Error("Could not construct tx: input=" + totalInput + ", output=" + totalOutput + ", fee=" + esitmatedFee);
        }
        try {
            tx = new (this.getBitCoreLib()).Transaction().from(pickedUtxos);
            for (var _i = 0, vouts_1 = vouts; _i < vouts_1.length; _i++) {
                var vout = vouts_1[_i];
                tx.to(vout.toAddress, vout.amount.toNumber());
            }
            tx.fee(esitmatedFee.toNumber());
            if (totalInput.gt(totalOutput.plus(esitmatedFee))) {
                tx.change(pickedUtxos[0].address);
            }
        }
        catch (e) {
            logger.error("BitcoinBasedGateway::constructRawTransaction failed due to error: ", e);
            throw new Error("Could not construct raw tx error=" + e.toString());
        }
        var txid;
        var unsignedRaw;
        try {
            txid = tx.hash;
            unsignedRaw = JSON.stringify(tx.toObject());
        }
        catch (err) {
            logger.error("Could not serialize tx due to error: ", err);
            return null;
        }
        try {
            var revivedTx = this.reconstructRawTx(unsignedRaw);
            if (txid !== revivedTx.txid) {
                throw new Error("Revived transaction has different txid");
            }
            if (unsignedRaw !== revivedTx.unsignedRaw) {
                throw new Error("Revived transaction has different raw data");
            }
        }
        catch (err) {
            logger.error("Could not construct tx due to error: ", err);
            return null;
        }
        return { txid: txid, unsignedRaw: unsignedRaw };
    };
    BitcoinBasedGateway.prototype._getOneBlock = function (blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var blockHash, block, blockProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof blockIdentifier === 'number')) return [3, 2];
                        return [4, this._rpcClient.call('getblockhash', [blockIdentifier])];
                    case 1:
                        blockHash = _a.sent();
                        return [3, 3];
                    case 2:
                        blockHash = blockIdentifier;
                        _a.label = 3;
                    case 3: return [4, this._rpcClient.call('getblock', [blockHash])];
                    case 4:
                        block = _a.sent();
                        blockProps = {
                            hash: block.hash,
                            number: block.height,
                            timestamp: block.time,
                        };
                        return [2, new Block_1.Block(blockProps, block.tx)];
                }
            });
        });
    };
    BitcoinBasedGateway.prototype._getOneTransaction = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var apiEndpoint, response, e_6, txInfo, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiEndpoint = this.getInsightAPIEndpoint();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, axios_1.default.get(apiEndpoint + "/tx/" + txid)];
                    case 2:
                        response = _a.sent();
                        return [3, 4];
                    case 3:
                        e_6 = _a.sent();
                        throw e_6;
                    case 4:
                        txInfo = response.data;
                        if (!txInfo.blockhash) {
                            return [2, null];
                        }
                        return [4, this.getOneBlock(txInfo.blockhash)];
                    case 5:
                        block = _a.sent();
                        return [2, new BitcoinBasedTransaction_1.BitcoinBasedTransaction(this.getCurrency(), txInfo, block)];
                }
            });
        });
    };
    __decorate([
        Utils_1.override,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "isValidAddressAsync", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "createAccountAsync", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Object)
    ], BitcoinBasedGateway.prototype, "reconstructRawTx", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "getBlockCount", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "getAddressBalance", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "getTransactionStatus", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "getOneAddressUtxos", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "getMultiAddressesUtxos", null);
    __decorate([
        Utils_1.override,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "getBlockTransactions", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "_getOneBlock", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BitcoinBasedGateway.prototype, "_getOneTransaction", null);
    return BitcoinBasedGateway;
}(UTXOBasedGateway_1.UTXOBasedGateway));
exports.BitcoinBasedGateway = BitcoinBasedGateway;
//# sourceMappingURL=BitcoinBasedGateway.js.map