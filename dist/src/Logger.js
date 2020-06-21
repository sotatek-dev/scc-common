"use strict";
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
var winston_1 = __importDefault(require("winston"));
var util_1 = __importDefault(require("util"));
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
            return winston_1.default.loggers.get(name).error(msg);
        },
        fatal: function (msg) {
            return winston_1.default.loggers.get(name).error(msg);
        },
    };
}
exports.getLogger = getLogger;
//# sourceMappingURL=Logger.js.map