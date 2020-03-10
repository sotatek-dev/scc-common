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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var winston_1 = __importDefault(require("winston"));
var util_1 = __importDefault(require("util"));
var EnvConfigRegistry_1 = __importDefault(require("./registries/EnvConfigRegistry"));
var __1 = require("..");
var ERROR_STASHES = [];
var ERROR_SENDING_INTERVAL;
if (process.env.ERROR_SENDING_INTERVAL) {
    ERROR_SENDING_INTERVAL = parseInt(process.env.ERROR_SENDING_INTERVAL, 10);
}
if (!ERROR_SENDING_INTERVAL || isNaN(ERROR_SENDING_INTERVAL)) {
    ERROR_SENDING_INTERVAL = 15 * 60 * 1000;
}
var _mailCallback;
setInterval(notifyErrors, ERROR_SENDING_INTERVAL);
var enumerateErrorFormat = winston_1.default.format(function (info) {
    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack,
        }, info);
    }
    return info;
});
function getLogger(name) {
    var has = winston_1.default.loggers.has(name);
    if (!has) {
        var transports = [];
        transports.push(new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(function (info) {
                var timestamp = info.timestamp, level = info.level, message = info.message, extra = __rest(info, ["timestamp", "level", "message"]);
                return timestamp + " [" + level + "]: " + message + " " + (Object.keys(extra).length ? util_1.default.inspect(extra) : '');
            })),
            stderrLevels: ['error'],
        }));
        winston_1.default.loggers.add(name, {
            level: process.env.LOG_LEVEL || 'debug',
            format: winston_1.default.format.combine(enumerateErrorFormat()),
            transports: transports,
        });
    }
    return {
        debug: function (msg) {
            return winston_1.default.loggers.get(name).debug(msg);
        },
        info: function (msg) {
            return winston_1.default.loggers.get(name).info(msg);
        },
        warn: function (msg) {
            return winston_1.default.loggers.get(name).warn(msg);
        },
        error: function (msg) {
            ERROR_STASHES.push("[ERROR] " + msg);
            return winston_1.default.loggers.get(name).error(msg);
        },
        fatal: function (msg) {
            ERROR_STASHES.push("[ERROR] " + msg);
            return winston_1.default.loggers.get(name).error(msg);
        },
        notifyErrorsImmediately: function () {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, notifyErrors()];
                        case 1:
                            _a.sent();
                            return [3, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.error("======= UNCAUGHT ERROR NOTIFYING BEGIN =======");
                            console.error(err_1);
                            console.error("======= UNCAUGHT ERROR NOTIFYING END =======");
                            return [3, 3];
                        case 3: return [2];
                    }
                });
            });
        },
    };
}
exports.getLogger = getLogger;
function registerMailEventCallback(callback) {
    _mailCallback = callback;
    getLogger('Logger').info("MailService::A callback has just been registered");
}
exports.registerMailEventCallback = registerMailEventCallback;
function notifyErrors() {
    return __awaiter(this, void 0, void 0, function () {
        var messages, mailReceiver, appName, env, subject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ERROR_STASHES.length) {
                        return [2];
                    }
                    messages = lodash_1.default.uniq(ERROR_STASHES);
                    ERROR_STASHES = [];
                    mailReceiver = EnvConfigRegistry_1.default.getCustomEnvConfig('MAIL_RECEIVER');
                    if (!mailReceiver) {
                        mailReceiver = EnvConfigRegistry_1.default.getCustomEnvConfig('MAILER_RECEIVER');
                    }
                    appName = process.env.APP_NAME || 'Exchange Wallet';
                    env = process.env.NODE_ENV || 'development';
                    subject = "[" + appName + "][" + env + "] Error Notifier";
                    if (!_mailCallback) return [3, 2];
                    return [4, _mailCallback(messages)];
                case 1:
                    _a.sent();
                    return [2];
                case 2:
                    __1.Utils.sendMail(mailReceiver, subject, "" + messages.join('<br />'));
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=Logger.js.map