"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("./Transaction");
var TransferEntry_1 = require("./TransferEntry");
var Utils_1 = require("../Utils");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var UTXOBasedTransaction = (function (_super) {
    __extends(UTXOBasedTransaction, _super);
    function UTXOBasedTransaction(currency, tx, block) {
        var _this = this;
        var txProps = {
            confirmations: tx.confirmations,
            height: block.number,
            timestamp: new Date(block.timestamp).getTime(),
            txid: tx.txid,
        };
        _this = _super.call(this, txProps, block) || this;
        _this.currency = currency;
        _this.vIns = tx.vin;
        _this.vOuts = tx.vout;
        return _this;
    }
    UTXOBasedTransaction.prototype.getSatoshiFactor = function () {
        return 1e8;
    };
    UTXOBasedTransaction.prototype._extractEntries = function () {
        var _this = this;
        var entries = [];
        this.vIns.forEach(function (vIn) {
            var entry = _this._convertVInToTransferEntry(vIn);
            if (entry) {
                entries.push(entry);
            }
        });
        this.vOuts.forEach(function (vOut) {
            var entry = _this._convertVOutToTransferEntry(vOut);
            if (entry) {
                entries.push(entry);
            }
        });
        return TransferEntry_1.TransferEntry.mergeEntries(entries);
    };
    UTXOBasedTransaction.prototype.getNetworkFee = function () {
        var result = new bignumber_js_1.default(0);
        this.extractEntries().forEach(function (entry) {
            result = result.plus(entry.amount);
        });
        return result.times(-1);
    };
    UTXOBasedTransaction.prototype._convertVInToTransferEntry = function (vIn) {
        if (!vIn.addr) {
            return null;
        }
        return {
            amount: new bignumber_js_1.default(-vIn.value * this.getSatoshiFactor()),
            currency: this.currency,
            address: vIn.addr,
            txid: this.txid,
            tx: this,
        };
    };
    UTXOBasedTransaction.prototype._convertVOutToTransferEntry = function (vOut) {
        var scriptPubKey = vOut.scriptPubKey;
        if (!scriptPubKey.addresses || !scriptPubKey.addresses.length || !scriptPubKey.addresses[0]) {
            return null;
        }
        if (vOut.scriptPubKey.addresses.length > 1) {
            var multiSigAddress_1 = 'MULTI_SIG';
            vOut.scriptPubKey.addresses.forEach(function (address) {
                multiSigAddress_1 += '|' + address;
            });
            return {
                amount: new bignumber_js_1.default(vOut.value * this.getSatoshiFactor()),
                currency: this.currency,
                address: multiSigAddress_1,
                tx: this,
                txid: this.txid,
            };
        }
        return {
            amount: new bignumber_js_1.default(vOut.value * this.getSatoshiFactor()),
            currency: this.currency,
            address: vOut.scriptPubKey.addresses[0],
            txid: this.txid,
            tx: this,
        };
    };
    __decorate([
        Utils_1.implement,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Array)
    ], UTXOBasedTransaction.prototype, "_extractEntries", null);
    return UTXOBasedTransaction;
}(Transaction_1.Transaction));
exports.UTXOBasedTransaction = UTXOBasedTransaction;
//# sourceMappingURL=UTXOBasedTransaction.js.map