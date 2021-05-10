"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNumber = exports.implement = exports.override = exports.Utils = void 0;
try {
    require('dotenv').config();
}
catch (e) {
    console.error(e.toString());
    process.exit(1);
}
if (process.env.isEnvSet_KnV5Ha0UlAAEME69I6KA === '1') {
    throw new Error("Something went wrong. The [sota-common] lib declared multiple times.");
}
process.env.isEnvSet_KnV5Ha0UlAAEME69I6KA = '1';
var Utils = __importStar(require("./src/Utils"));
exports.Utils = Utils;
var Utils_1 = require("./src/Utils");
Object.defineProperty(exports, "override", { enumerable: true, get: function () { return Utils_1.override; } });
Object.defineProperty(exports, "implement", { enumerable: true, get: function () { return Utils_1.implement; } });
__exportStar(require("./src/types"), exports);
__exportStar(require("./src/enums"), exports);
__exportStar(require("./src/interfaces"), exports);
__exportStar(require("./src/Logger"), exports);
__exportStar(require("./src/BaseWorker"), exports);
__exportStar(require("./src/BaseWorker2"), exports);
__exportStar(require("./src/BaseIntervalWorker"), exports);
__exportStar(require("./src/BaseIntervalWorker2"), exports);
__exportStar(require("./src/BaseCurrencyWorker"), exports);
__exportStar(require("./src/BasePlatformWorker"), exports);
__exportStar(require("./src/BaseCrawler"), exports);
__exportStar(require("./src/BasePlatformCrawler"), exports);
__exportStar(require("./src/BitcoinBasedCrawler"), exports);
__exportStar(require("./src/NativeAssetCrawler"), exports);
__exportStar(require("./src/CustomAssetCrawler"), exports);
__exportStar(require("./src/BaseGateway"), exports);
__exportStar(require("./src/AccountBasedGateway"), exports);
__exportStar(require("./src/UTXOBasedGateway"), exports);
__exportStar(require("./src/BitcoinBasedGateway"), exports);
__exportStar(require("./src/BaseWebServer"), exports);
__exportStar(require("./src/RPCClient"), exports);
__exportStar(require("./src/Logger"), exports);
__exportStar(require("./src/RedisChannel"), exports);
__exportStar(require("./src/registries"), exports);
__exportStar(require("./src/Mailer"), exports);
__exportStar(require("./src/BasePlatformCrawler2"), exports);
var bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.BigNumber = bignumber_js_1.default;
//# sourceMappingURL=index.js.map