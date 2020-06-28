"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var util_1 = __importDefault(require("util"));
var URL = __importStar(require("url"));
var enums_1 = require("./enums");
var Logger_1 = require("./Logger");
var registries_1 = require("./registries");
var logger = Logger_1.getLogger('BaseWebServer');
var BaseWebServer = (function () {
    function BaseWebServer(platform) {
        this.app = express_1.default();
        this._currency = registries_1.CurrencyRegistry.getOneNativeCurrency(platform);
        this._parseConfig(platform);
        this.setup();
    }
    BaseWebServer.prototype._parseConfig = function (platform) {
        var config = registries_1.CurrencyRegistry.getCurrencyConfig(this._currency);
        if (!config) {
            throw new Error("Cannot find configuration for " + this._currency.symbol + " at config table");
        }
        var internalEndpoint = URL.parse("" + config.internalEndpoint);
        if (!internalEndpoint.protocol || !internalEndpoint.hostname || !internalEndpoint.port) {
            logger.info("Set api endpoint: " + config.internalEndpoint + ". Need corrected format: {host}:{port}");
            throw new Error("Api endpoint for " + this._currency.symbol + " have incorrect format");
        }
        this.protocol = internalEndpoint.protocol;
        this.host = internalEndpoint.hostname;
        this.port = parseInt(internalEndpoint.port, 10);
    };
    BaseWebServer.prototype.start = function () {
        var _this = this;
        this.app.listen(this.port, this.host, function () {
            console.log("server started at " + _this.protocol + "://" + _this.host + ":" + _this.port);
        });
    };
    BaseWebServer.prototype.getGateway = function (symbol) {
        var currency = registries_1.CurrencyRegistry.getOneCurrency(symbol);
        return registries_1.GatewayRegistry.getGatewayInstance(currency);
    };
    BaseWebServer.prototype.createNewAddress = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getGateway(this._currency.symbol).createAccountAsync()];
                    case 1:
                        address = _a.sent();
                        res.json(address);
                        return [2];
                }
            });
        });
    };
    BaseWebServer.prototype.getAddressBalance = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currency, address, balance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, currency = _a.currency, address = _a.address;
                        return [4, this.getGateway(currency).getAddressBalance(address)];
                    case 1:
                        balance = (_b.sent()).toFixed();
                        res.json({ balance: balance });
                        return [2];
                }
            });
        });
    };
    BaseWebServer.prototype.validateAddress = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var address, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = req.params.address;
                        return [4, this.getGateway(this._currency.symbol).isValidAddressAsync(address)];
                    case 1:
                        isValid = _a.sent();
                        res.json({ isValid: isValid });
                        return [2];
                }
            });
        });
    };
    BaseWebServer.prototype.isNeedTag = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var address, isNeed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = req.params.address;
                        return [4, this.getGateway(this._currency.symbol).isNeedTagAsync(address)];
                    case 1:
                        isNeed = _a.sent();
                        res.json({ isNeed: isNeed });
                        return [2];
                }
            });
        });
    };
    BaseWebServer.prototype.getTransactionDetails = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currency, txid, tx, entries, extractedEntries, fee, resObj;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, currency = _a.currency, txid = _a.txid;
                        return [4, this.getGateway(currency).getOneTransaction(txid)];
                    case 1:
                        tx = _b.sent();
                        if (!tx) {
                            return [2, res.status(404).json({ error: "Transaction not found: " + txid })];
                        }
                        entries = [];
                        extractedEntries = tx.extractEntries();
                        extractedEntries.forEach(function (e) {
                            entries.push({
                                address: e.address,
                                value: e.amount.toFixed(),
                                valueString: e.amount.toFixed(),
                            });
                        });
                        fee = tx.getNetworkFee();
                        resObj = {
                            id: txid,
                            date: '',
                            timestamp: tx.block.timestamp,
                            blockHash: tx.block.hash,
                            blockHeight: tx.block.number,
                            confirmations: tx.confirmations,
                            txFee: fee.toString(),
                            entries: entries,
                        };
                        resObj = __assign(__assign({}, resObj), tx.extractAdditionalField());
                        return [2, res.json(resObj)];
                }
            });
        });
    };
    BaseWebServer.prototype.normalizeAddress = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var address, normalizedAddr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = req.params.address;
                        return [4, this.getGateway(this._currency.symbol).normalizeAddress(address)];
                    case 1:
                        normalizedAddr = _a.sent();
                        logger.info("WebService::normalizeAddress address=" + address + " result=" + normalizedAddr);
                        return [2, res.json(normalizedAddr)];
                }
            });
        });
    };
    BaseWebServer.prototype.generateSeed = function (req, res) {
        var mnemonic = this.getGateway(this._currency.symbol).generateSeed();
        logger.info("WebService::generateSeed");
        return res.json(mnemonic);
    };
    BaseWebServer.prototype.createNewHdWalletAddress = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accountIndex, path, seed, address;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.query, accountIndex = _a.accountIndex, path = _a.path, seed = _a.seed;
                        return [4, this.getGateway(this._currency.symbol).createAccountHdWalletAsync({
                                accountIndex: accountIndex,
                                path: path,
                                seed: seed,
                            })];
                    case 1:
                        address = _b.sent();
                        return [2, res.json(address)];
                }
            });
        });
    };
    BaseWebServer.prototype.checkHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4, this._getHealthStatus()];
                    case 1: return [2, (_a.status = _b.sent(), _a)];
                }
            });
        });
    };
    BaseWebServer.prototype._getHealthStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, enums_1.WebServiceStatus.OK];
            });
        });
    };
    BaseWebServer.prototype.estimateFee = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var currency, _a, total_inputs, recent_withdrawal_fee, use_lower_network_fee, totalInputs, currentCurrency, isConsolidate, fee;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currency = req.params.currency;
                        _a = req.query, total_inputs = _a.total_inputs, recent_withdrawal_fee = _a.recent_withdrawal_fee, use_lower_network_fee = _a.use_lower_network_fee;
                        totalInputs = parseInt(total_inputs, 10);
                        currentCurrency = registries_1.CurrencyRegistry.getOneCurrency(currency);
                        isConsolidate = !currentCurrency.isNative;
                        return [4, this.getGateway(currency).estimateFee({
                                totalInputs: totalInputs,
                                useLowerNetworkFee: use_lower_network_fee,
                                isConsolidate: isConsolidate,
                                recentWithdrawalFee: recent_withdrawal_fee,
                            })];
                    case 1:
                        fee = _b.sent();
                        return [2, res.json({
                                fee: fee.toNumber(),
                            })];
                }
            });
        });
    };
    BaseWebServer.prototype.setup = function () {
        var _this = this;
        this.app.use(morgan_1.default('dev'));
        this.app.get('/api/:currency/address', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.createNewAddress(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_1 = _a.sent();
                        logger.error("createNewAddress err=" + util_1.default.inspect(e_1));
                        res.status(500).json({ error: e_1.message || e_1.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/address/:address/balance', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getAddressBalance(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_2 = _a.sent();
                        logger.error("getAddressBalance err=" + util_1.default.inspect(e_2));
                        res.status(500).json({ error: e_2.message || e_2.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/address/:address/validate', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.validateAddress(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_3 = _a.sent();
                        logger.error("validateAddress err=" + util_1.default.inspect(e_3));
                        res.status(500).json({ error: e_3.message || e_3.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/address/:address/tag', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.isNeedTag(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_4 = _a.sent();
                        logger.error("validateAddress err=" + util_1.default.inspect(e_4));
                        res.status(500).json({ error: e_4.message || e_4.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/tx/:txid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getTransactionDetails(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_5 = _a.sent();
                        logger.error("getTransactionDetails err=" + util_1.default.inspect(e_5));
                        res.status(500).json({ error: e_5.message || e_5.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/address/:address/normalized', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.normalizeAddress(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_6 = _a.sent();
                        logger.error("convertChecksumAddress err=" + util_1.default.inspect(e_6));
                        res.status(500).json({ error: e_6.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/generate_seed', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.generateSeed(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_7 = _a.sent();
                        logger.error("generateSeed err=" + util_1.default.inspect(e_7));
                        res.status(500).json({ error: e_7.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/health', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = res.status(200)).json;
                        return [4, this.checkHealth()];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/address/hd_wallet', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.createNewHdWalletAddress(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_8 = _a.sent();
                        logger.error("createNewHdWalletAddress err=" + util_1.default.inspect(e_8));
                        res.status(500).json({ error: e_8.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
        this.app.get('/api/:currency/estimate_fee/:total_inputs*?/:recent_withdrawal_fee*?/:use_lower_network_fee*?', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.estimateFee(req, res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_9 = _a.sent();
                        logger.error("estimate fee err=" + util_1.default.inspect(e_9));
                        res.status(500).json({ error: e_9.toString() });
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
    };
    BaseWebServer.prototype.getProtocol = function () {
        return this.protocol;
    };
    BaseWebServer.prototype.getHost = function () {
        return this.host;
    };
    BaseWebServer.prototype.getPort = function () {
        return this.port;
    };
    return BaseWebServer;
}());
exports.BaseWebServer = BaseWebServer;
//# sourceMappingURL=BaseWebServer.js.map