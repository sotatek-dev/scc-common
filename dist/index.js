"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
try {
    require('dotenv-safe').config();
}
catch (e) {
    console.error(e.toString());
    process.exit(1);
}
if (process.env.isEnvSet_KnV5Ha0UlAAEME69I6KA === '1') {
    throw new Error("Something went wrong. The [sota-common] lib declared multiple times.");
}
process.env.isEnvSet_KnV5Ha0UlAAEME69I6KA = '1';
require("./EnvDecrypt");
var Utils = __importStar(require("./src/Utils"));
exports.Utils = Utils;
var Utils_1 = require("./src/Utils");
exports.override = Utils_1.override;
exports.implement = Utils_1.implement;
__export(require("./src/types"));
__export(require("./src/enums"));
__export(require("./src/Logger"));
__export(require("./src/BaseIntervalWorker"));
__export(require("./src/BaseIntervalWorker2"));
__export(require("./src/BaseCurrencyWorker"));
__export(require("./src/BasePlatformWorker"));
__export(require("./src/BaseCrawler"));
__export(require("./src/BasePlatformCrawler"));
__export(require("./src/BitcoinBasedCrawler"));
__export(require("./src/NativeAssetCrawler"));
__export(require("./src/CustomAssetCrawler"));
__export(require("./src/BaseGateway"));
__export(require("./src/AccountBasedGateway"));
__export(require("./src/UTXOBasedGateway"));
__export(require("./src/BitcoinBasedGateway"));
__export(require("./src/BaseMQConsumer"));
__export(require("./src/BaseMQProducer"));
__export(require("./src/BaseWebServer"));
__export(require("./src/RPCClient"));
__export(require("./src/Logger"));
__export(require("./src/RedisChannel"));
__export(require("./src/registries"));
__export(require("./src/Mailer"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.BigNumber = bignumber_js_1.default;
//# sourceMappingURL=index.js.map