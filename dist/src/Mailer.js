"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mailer = __importStar(require("nodemailer"));
var Logger_1 = require("./Logger");
var EnvConfigRegistry_1 = require("./registries/EnvConfigRegistry");
var instance;
var logger = Logger_1.getLogger('MailerService');
var Mailer = (function () {
    function Mailer() {
        this.config();
    }
    Mailer.getInstance = function () {
        if (!instance) {
            instance = new Mailer();
        }
        return instance;
    };
    Mailer.prototype.getOptions = function () {
        var options = __assign(__assign({}, this.options), { auth: {
                user: '**************',
                pass: '**************',
            } });
        return options;
    };
    Mailer.prototype.sendMail = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var mailOptions, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mailOptions = {
                            headers: {
                                'Return-Path': !!options.returnPath ? options.returnPath : '',
                            },
                            from: options.from || this.options.auth.user,
                            to: options.to,
                            cc: options.cc,
                            bcc: options.bcc,
                            envelope: {
                                from: options.from || this.options.auth.user,
                                to: options.to,
                            },
                            subject: options.subject,
                            html: options.content,
                        };
                        if (!this.transporter) {
                            throw new Error("Mailer transpoter was not set, transporter=" + this.transporter + ". Please check your configure.");
                        }
                        return [4, this.transporter.sendMail(mailOptions)];
                    case 1:
                        info = _a.sent();
                        logger.info("Message sent: " + info.messageId);
                        logger.info("Preview URL: " + mailer.getTestMessageUrl(info));
                        return [2, info];
                }
            });
        });
    };
    Mailer.prototype.config = function () {
        var host = EnvConfigRegistry_1.EnvConfigRegistry.getCustomEnvConfig('MAIL_HOST')
            ? EnvConfigRegistry_1.EnvConfigRegistry.getCustomEnvConfig('MAIL_HOST')
            : 'smtp.gmail.com';
        var port = !!EnvConfigRegistry_1.EnvConfigRegistry.getCustomEnvConfig('MAIL_PORT')
            ? parseInt(EnvConfigRegistry_1.EnvConfigRegistry.getCustomEnvConfig('MAIL_PORT'), 10)
            : 465;
        var user = EnvConfigRegistry_1.EnvConfigRegistry.getCustomEnvConfig('MAIL_USERNAME');
        var password = EnvConfigRegistry_1.EnvConfigRegistry.getCustomEnvConfig('MAIL_PASSWORD');
        if (!user || !password) {
            throw new Error("Mailer could not setup with credentials: user=" + user + ", password=" + password);
        }
        this.options = {
            host: host,
            port: port,
            secure: port === 465 ? true : false,
            auth: {
                user: user,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false,
            },
            logger: true,
        };
        this.transporter = mailer.createTransport(this.options);
    };
    return Mailer;
}());
exports.Mailer = Mailer;
//# sourceMappingURL=Mailer.js.map