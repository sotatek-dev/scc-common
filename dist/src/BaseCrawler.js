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
exports.BaseCrawler = void 0;
var uuid_1 = require("uuid");
var BaseIntervalWorker_1 = __importDefault(require("./BaseIntervalWorker"));
var CurrencyRegistry_1 = __importDefault(require("./registries/CurrencyRegistry"));
var Utils_1 = require("./Utils");
var registries_1 = require("./registries");
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger('BaseCrawler');
var LATEST_PROCESSED_BLOCK = new Map();
var BaseCrawler = (function (_super) {
    __extends(BaseCrawler, _super);
    function BaseCrawler(platform, options) {
        var _this = _super.call(this) || this;
        _this._id = uuid_1.v1();
        _this._options = options;
        _this._nativeCurrency = CurrencyRegistry_1.default.getOneNativeCurrency(platform);
        return _this;
    }
    BaseCrawler.prototype.getInstanceId = function () {
        return this._id;
    };
    BaseCrawler.prototype.getOptions = function () {
        return this._options;
    };
    BaseCrawler.prototype.getNativeCurrency = function () {
        return this._nativeCurrency;
    };
    BaseCrawler.prototype.getCrawlType = function () {
        return 'deposit';
    };
    BaseCrawler.prototype.getBlockNumInOneGo = function () {
        return this.getRequiredConfirmations() + 1;
    };
    BaseCrawler.prototype.getAverageBlockTime = function () {
        return CurrencyRegistry_1.default.getCurrencyConfig(this._nativeCurrency).averageBlockTime;
    };
    BaseCrawler.prototype.getRequiredConfirmations = function () {
        return CurrencyRegistry_1.default.getCurrencyConfig(this._nativeCurrency).requiredConfirmations;
    };
    BaseCrawler.prototype.getPlatformGateway = function () {
        return registries_1.GatewayRegistry.getGatewayInstance(this._nativeCurrency);
    };
    BaseCrawler.prototype.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    BaseCrawler.prototype.doProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latestNetworkBlock, latestProcessedBlock, fromBlockNumber, toBlockNumber, safeBlockNumber, recentBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getPlatformGateway().getBlockCount()];
                    case 1:
                        latestNetworkBlock = _a.sent();
                        latestProcessedBlock = LATEST_PROCESSED_BLOCK.get(this._id);
                        if (!latestProcessedBlock && process.env.FORCE_CRAWL_BLOCK) {
                            latestProcessedBlock = parseInt(process.env.FORCE_CRAWL_BLOCK, 10);
                        }
                        if (!(!latestProcessedBlock || isNaN(latestProcessedBlock))) return [3, 3];
                        return [4, this._options.getLatestCrawledBlockNumber(this)];
                    case 2:
                        latestProcessedBlock = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!latestProcessedBlock) {
                            latestProcessedBlock = latestNetworkBlock - 1;
                        }
                        fromBlockNumber = latestProcessedBlock + 1;
                        if (fromBlockNumber > latestNetworkBlock) {
                            logger.info("The newest block has been processed. Wait for the next tick...", { fromBlockNumber: fromBlockNumber, latestNetworkBlock: latestNetworkBlock });
                            return [2];
                        }
                        toBlockNumber = latestProcessedBlock + this.getBlockNumInOneGo();
                        if (toBlockNumber > latestNetworkBlock) {
                            toBlockNumber = latestNetworkBlock;
                        }
                        logger.info("Crawler is starting for [" + this.getNativeCurrency().symbol + "]", { fromBlockNumber: fromBlockNumber, toBlockNumber: toBlockNumber });
                        return [4, this.processBlocks(fromBlockNumber, toBlockNumber, latestNetworkBlock)];
                    case 4:
                        _a.sent();
                        safeBlockNumber = latestNetworkBlock - this.getRequiredConfirmations();
                        if (safeBlockNumber > toBlockNumber) {
                            safeBlockNumber = toBlockNumber;
                        }
                        return [4, this.getPlatformGateway().getOneBlock(safeBlockNumber)];
                    case 5:
                        recentBlock = _a.sent();
                        if (!recentBlock) return [3, 7];
                        return [4, this.getOptions().onBlockCrawled(this, recentBlock)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        LATEST_PROCESSED_BLOCK.set(this._id, safeBlockNumber);
                        if (toBlockNumber >= latestNetworkBlock) {
                            logger.info("Have processed newest block already. Will wait for a while until next check...", { toBlockNumber: toBlockNumber, latestNetworkBlock: latestNetworkBlock });
                            this.setNextTickTimer(this.getAverageBlockTime());
                        }
                        else {
                            this.setNextTickTimer(1);
                        }
                        return [2];
                }
            });
        });
    };
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BaseCrawler.prototype, "prepare", null);
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BaseCrawler.prototype, "doProcess", null);
    return BaseCrawler;
}(BaseIntervalWorker_1.default));
exports.BaseCrawler = BaseCrawler;
exports.default = BaseCrawler;
//# sourceMappingURL=BaseCrawler.js.map