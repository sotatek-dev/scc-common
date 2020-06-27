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
var winston_cloudwatch_1 = __importDefault(require("winston-cloudwatch"));
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
    var isLoggerExisted = winston_1.default.loggers.has(name);
    if (!isLoggerExisted) {
        createLogger(name);
    }
    return winston_1.default.loggers.get(name);
}
exports.getLogger = getLogger;
function createLogger(name) {
    var transports = [];
    var consoleTransport = _createConsoleTransport();
    transports.push(consoleTransport);
    if (process.env.CWL_ENABLED === 'true') {
        var cwlTransport = _createCwlTransport();
        transports.push(cwlTransport);
    }
    winston_1.default.loggers.add(name, {
        level: process.env.LOG_LEVEL || 'info',
        format: winston_1.default.format.combine(enumerateErrorFormat()),
        transports: transports,
    });
}
function _createConsoleTransport() {
    return new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(function (info) {
            var timestamp = info.timestamp, level = info.level, message = info.message, extra = __rest(info, ["timestamp", "level", "message"]);
            return timestamp + " [" + level + "]: " + message + " " + (Object.keys(extra).length ? util_1.default.inspect(extra) : '');
        })),
        stderrLevels: ['error'],
    });
}
function _createCwlTransport() {
    var logGroupName = process.env.CWL_LOG_GROUP_NAME || 'sotatek-scc-common';
    var logStreamPrefix = process.env.CWL_LOG_STREAM_PREFIX || 'sotatek-scc-common';
    var createdDate = new Date().toISOString().split('T')[0];
    var randomSuffix = Math.random().toString(36).substr(2, 5);
    var logStreamName = logStreamPrefix + "-" + createdDate + "-" + randomSuffix;
    var uploadRate = process.env.CWL_UPLOAD_RATE ? parseInt(process.env.CWL_UPLOAD_RATE, 10) : undefined;
    return new winston_cloudwatch_1.default({
        level: process.env.CWL_LOG_LEVEL || process.env.LOG_LEVEL || 'info',
        logGroupName: logGroupName,
        logStreamName: logStreamName,
        jsonMessage: true,
        uploadRate: uploadRate,
        awsAccessKeyId: process.env.CWL_AWS_ACCESS_KEY_ID,
        awsSecretKey: process.env.CWL_AWS_ACCESS_KEY_SECRET,
        awsRegion: process.env.CWL_AWS_REGION_ID,
    });
}
//# sourceMappingURL=Logger.js.map