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
var BaseCrawler_1 = __importDefault(require("./BaseCrawler"));
var registries_1 = require("./registries");
var Logger_1 = require("./Logger");
var Utils = __importStar(require("./Utils"));
var p_limit_1 = __importDefault(require("p-limit"));
var limit = p_limit_1.default(1);
var logger = Logger_1.getLogger('BasePlatformCrawler');
var BasePlatformCrawler = (function (_super) {
    __extends(BasePlatformCrawler, _super);
    function BasePlatformCrawler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BasePlatformCrawler.prototype.processBlocks = function (fromBlock, toBlock, latestNetworkBlock) {
        return __awaiter(this, void 0, void 0, function () {
            var allCurrencies;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allCurrencies = registries_1.CurrencyRegistry.getCurrenciesOfPlatform(this._nativeCurrency.platform);
                        return [4, Utils.PromiseAll(allCurrencies.map(function (c) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    return [2, limit(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var gateway, allTxs;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        gateway = registries_1.GatewayRegistry.getGatewayInstance(c);
                                                        return [4, gateway.getMultiBlocksTransactions(fromBlock, toBlock)];
                                                    case 1:
                                                        allTxs = _a.sent();
                                                        return [4, this._options.onCrawlingTxs(this, allTxs)];
                                                    case 2:
                                                        _a.sent();
                                                        logger.info(this.constructor.name + "::processBlocks FINISH: currency=" + c.networkSymbol +
                                                            ("\tblock=" + fromBlock + "\u2192" + toBlock + " / " + latestNetworkBlock) +
                                                            ("\ttxs=" + allTxs.length));
                                                        return [2];
                                                }
                                            });
                                        }); })];
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return BasePlatformCrawler;
}(BaseCrawler_1.default));
exports.BasePlatformCrawler = BasePlatformCrawler;
//# sourceMappingURL=BasePlatformCrawler.js.map