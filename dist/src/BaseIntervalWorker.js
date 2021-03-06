"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseIntervalWorker = void 0;
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger('BaseIntervalWorker');
var BaseIntervalWorker = (function () {
    function BaseIntervalWorker() {
        this._isStarted = false;
        this._nextTickTimer = 30000;
        this._processingTimeout = 300000;
    }
    BaseIntervalWorker.prototype.start = function () {
        var _this = this;
        if (this._isStarted) {
            logger.warn("Trying to start processor twice: " + this.constructor.name);
            return;
        }
        this._isStarted = true;
        this.prepare()
            .then(function (res) {
            logger.info(_this.constructor.name + " finished preparing. Will start the first tick shortly...");
            _this.onTick();
        })
            .catch(function (err) {
            throw err;
        });
    };
    BaseIntervalWorker.prototype.getNextTickTimer = function () {
        return this._nextTickTimer;
    };
    BaseIntervalWorker.prototype.getProcessingTimeout = function () {
        return this._processingTimeout;
    };
    BaseIntervalWorker.prototype.setNextTickTimer = function (timeout) {
        this._nextTickTimer = timeout;
    };
    BaseIntervalWorker.prototype.setProcessingTimeout = function (timeout) {
        this._processingTimeout = timeout;
    };
    BaseIntervalWorker.prototype.onTick = function () {
        var _this = this;
        var duration = this.getProcessingTimeout();
        var classname = this.constructor.name;
        var timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.error(classname + "::onTick timeout (" + duration + " ms) is exceeded. Worker will be restarted shortly...");
                process.exit(1);
                return [2];
            });
        }); }, duration);
        this.doProcess()
            .then(function () {
            clearTimeout(timer);
            setTimeout(function () {
                _this.onTick();
            }, _this.getNextTickTimer());
        })
            .catch(function (err) {
            clearTimeout(timer);
            logger.error(classname + ": The worker will be restarted shortly due to error: ", err);
            setTimeout(function () {
                _this.onTick();
            }, _this.getNextTickTimer());
        });
    };
    BaseIntervalWorker.prototype.getWorkerInfo = function () {
        return this.constructor.name;
    };
    return BaseIntervalWorker;
}());
exports.BaseIntervalWorker = BaseIntervalWorker;
exports.default = BaseIntervalWorker;
//# sourceMappingURL=BaseIntervalWorker.js.map