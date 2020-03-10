"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("redis");
var util_1 = __importDefault(require("util"));
var registries_1 = require("./registries");
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger('RedisChannel');
var sub = null;
function getRedisSubscriber() {
    if (sub) {
        return sub;
    }
    var host = registries_1.EnvConfigRegistry.getCustomEnvConfig('REDIS_HOST');
    var port = registries_1.EnvConfigRegistry.getCustomEnvConfig('REDIS_PORT');
    var url = registries_1.EnvConfigRegistry.getCustomEnvConfig('REDIS_URL');
    if ((!host && !url) || (!port && !url)) {
        throw new Error("Some redis configs are missing. REDIS_HOST=" + host + ", REDIS_PORT=" + port + ", REDIS_URL=" + url);
    }
    sub = redis_1.createClient({
        host: host,
        port: parseInt(port, 10),
        url: url,
    });
    var appId = registries_1.EnvConfigRegistry.getAppId();
    sub.subscribe("" + appId);
    return sub;
}
exports.getRedisSubscriber = getRedisSubscriber;
var client;
var promiseClient;
function getClient() {
    if (!registries_1.EnvConfigRegistry.isUsingRedis()) {
        throw new Error("Redis is not enabled now.");
    }
    if (!client) {
        var host = registries_1.EnvConfigRegistry.getCustomEnvConfig('REDIS_HOST');
        var port = registries_1.EnvConfigRegistry.getCustomEnvConfig('REDIS_PORT');
        var url = registries_1.EnvConfigRegistry.getCustomEnvConfig('REDIS_URL');
        client = redis_1.createClient({
            host: host,
            port: parseInt(port, 10),
            url: url,
        });
        promiseClient = {
            setex: util_1.default.promisify(client.setex).bind(client),
            set: util_1.default.promisify(client.set).bind(client),
            get: util_1.default.promisify(client.get).bind(client),
        };
    }
    return promiseClient;
}
exports.getClient = getClient;
//# sourceMappingURL=RedisChannel.js.map