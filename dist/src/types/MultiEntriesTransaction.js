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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("./Transaction");
var TransferEntry_1 = __importDefault(require("./TransferEntry"));
var bignumber_js_1 = require("bignumber.js");
var MultiEntriesTransaction = (function (_super) {
    __extends(MultiEntriesTransaction, _super);
    function MultiEntriesTransaction(props) {
        var _this = _super.call(this, {
            confirmations: props.lastNetworkBlockNumber - props.block.number + 1,
            height: props.block.number,
            timestamp: props.block.timestamp,
            txid: props.txid,
        }, props.block) || this;
        _this.inputs = props.inputs;
        _this.outputs = props.outputs;
        return _this;
    }
    MultiEntriesTransaction.prototype._extractEntries = function () {
        var _this = this;
        var entries = [];
        this.inputs.forEach(function (vIn) {
            var entry = _this._convertVInToTransferEntry(vIn);
            if (entry) {
                entries.push(entry);
            }
        });
        this.outputs.forEach(function (vOut) {
            var entry = _this._convertVoutToTransferEntry(vOut);
            if (entry) {
                entries.push(entry);
            }
        });
        return TransferEntry_1.default.mergeEntries(entries);
    };
    MultiEntriesTransaction.prototype.getExtraDepositData = function () {
        return Object.assign({}, _super.prototype.getExtraDepositData.call(this), {});
    };
    MultiEntriesTransaction.prototype._convertVInToTransferEntry = function (vIn) {
        return {
            amount: new bignumber_js_1.BigNumber(-vIn.amount),
            currency: vIn.currency,
            address: vIn.address,
            txid: this.txid,
            tx: this,
        };
    };
    MultiEntriesTransaction.prototype._convertVoutToTransferEntry = function (vOut) {
        return {
            amount: new bignumber_js_1.BigNumber(vOut.amount),
            currency: vOut.currency,
            address: vOut.address,
            txid: this.txid,
            tx: this,
        };
    };
    return MultiEntriesTransaction;
}(Transaction_1.Transaction));
exports.MultiEntriesTransaction = MultiEntriesTransaction;
exports.default = MultiEntriesTransaction;
//# sourceMappingURL=MultiEntriesTransaction.js.map