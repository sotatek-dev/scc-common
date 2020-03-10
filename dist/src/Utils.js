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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __importDefault(require("url"));
var __1 = require("..");
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger('Utils_Common');
var nodemailer = require('nodemailer');
function nowInMillis() {
    return Date.now();
}
exports.nowInMillis = nowInMillis;
function now() {
    return nowInMillis();
}
exports.now = now;
function nowInSeconds() {
    return (nowInMillis() / 1000) | 0;
}
exports.nowInSeconds = nowInSeconds;
function isValidURL(urlString) {
    try {
        var parsedUrl = new url_1.default.URL(urlString);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isValidURL = isValidURL;
function reflect(promise) {
    return promise
        .then(function (data) {
        return { data: data, status: 'resolved' };
    })
        .catch(function (error) {
        return { error: error, status: 'rejected' };
    });
}
exports.reflect = reflect;
function timeout(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
exports.timeout = timeout;
function PromiseAll(values) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, Promise.all(values.map(reflect))];
                                case 1: return [2, _a.sent()];
                            }
                        });
                    }); })().then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var errors;
                        return __generator(this, function (_a) {
                            errors = [];
                            results = res.map(function (r) {
                                if (r.status === 'rejected') {
                                    errors.push(r.error);
                                }
                                return r.data;
                            });
                            if (errors.length !== 0) {
                                throw errors[0];
                            }
                            return [2];
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2, results];
            }
        });
    });
}
exports.PromiseAll = PromiseAll;
function _removeDoubleQuote(value) {
    return value.replace(/\\\"/g, '').replace(/\"/g, '');
}
function override(container, key) {
    var baseType = Object.getPrototypeOf(container);
    if (typeof baseType[key] !== 'function') {
        var overrideError = 'Method ' + key + ' of ' + container.constructor.name + ' does not override any base class method';
        throw new Error(overrideError);
    }
}
exports.override = override;
function implement(container, key) {
    var baseType = Object.getPrototypeOf(container);
    if (typeof baseType[key] === 'function') {
        var overrideError = 'Method ' + key + ' of ' + container.constructor.name + ' implemented on base class';
        throw new Error(overrideError);
    }
}
exports.implement = implement;
function sendMail(mailReceiver, subject, text) {
    return __awaiter(this, void 0, void 0, function () {
        var mailUserName, mailPassword, mailHost, mailPort, mailFromName, mailFromAddress, mailDrive, mailEncryption, transporter, mailOptions, info, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mailReceiver || !isValidEmail(mailReceiver)) {
                        logger.warn("Invalid mail receiver: " + mailReceiver);
                        return [2];
                    }
                    mailUserName = __1.EnvConfigRegistry.getCustomEnvConfig('MAILER_ACCOUNT');
                    mailPassword = __1.EnvConfigRegistry.getCustomEnvConfig('MAILER_PASSWORD');
                    if (!(mailUserName && mailPassword)) return [3, 2];
                    return [4, sendNormalMail(mailUserName, mailPassword, mailReceiver, subject, text)];
                case 1:
                    _a.sent();
                    return [2];
                case 2:
                    mailUserName = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_USERNAME');
                    mailPassword = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_PASSWORD');
                    mailHost = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_HOST');
                    mailPort = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_PORT');
                    mailFromName = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_FROM_NAME');
                    mailFromAddress = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_FROM_ADDRESS');
                    mailDrive = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_DRIVER');
                    mailEncryption = __1.EnvConfigRegistry.getCustomEnvConfig('MAIL_ENCRYPTION');
                    if (!mailUserName || !mailPassword) {
                        logger.error("Revise this: MAILER_ACCOUNT=" + mailUserName + ", MAILER_PASSWORD=" + mailPassword + "}");
                        return [2];
                    }
                    transporter = nodemailer.createTransport({
                        host: mailHost,
                        port: mailPort,
                        secure: mailPort === '465' ? true : false,
                        auth: {
                            user: mailUserName,
                            pass: mailPassword,
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                    mailOptions = {
                        from: mailUserName,
                        to: mailReceiver,
                        subject: subject,
                        envelope: {
                            from: mailFromName + " <" + mailFromAddress + ">",
                            to: mailReceiver,
                        },
                        html: text,
                    };
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4, transporter.sendMail(mailOptions)];
                case 4:
                    info = _a.sent();
                    logger.info("Message sent: " + info.messageId);
                    logger.info("Preview URL: " + nodemailer.getTestMessageUrl(info));
                    return [3, 6];
                case 5:
                    e_1 = _a.sent();
                    logger.error(e_1);
                    return [3, 6];
                case 6: return [2];
            }
        });
    });
}
exports.sendMail = sendMail;
function sendNormalMail(mailerAccount, mailerPassword, mailerReceiver, subject, text, service) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, mailOptions, info, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transporter = nodemailer.createTransport({
                        service: service || 'gmail',
                        auth: {
                            user: mailerAccount,
                            pass: mailerPassword,
                        },
                    });
                    mailOptions = {
                        from: mailerAccount,
                        to: mailerReceiver,
                        subject: subject,
                        html: text,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, transporter.sendMail(mailOptions)];
                case 2:
                    info = _a.sent();
                    logger.info("Message sent: " + info.messageId);
                    logger.info("Preview URL: " + nodemailer.getTestMessageUrl(info));
                    return [3, 4];
                case 3:
                    e_2 = _a.sent();
                    logger.error(e_2);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.sendNormalMail = sendNormalMail;
function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
exports.isValidEmail = isValidEmail;
//# sourceMappingURL=Utils.js.map