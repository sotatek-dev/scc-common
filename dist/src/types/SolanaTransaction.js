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
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var MultiEntriesTransaction_1 = __importDefault(require("./MultiEntriesTransaction"));
var SolTransaction = (function (_super) {
    __extends(SolTransaction, _super);
    function SolTransaction(currency, tx, block, lastNetworkBlockNumber) {
        var _this = this;
        var props = {
            outputs: tx.outEntries,
            inputs: tx.inEntries,
            block: block,
            lastNetworkBlockNumber: lastNetworkBlockNumber,
            txid: tx.txHash,
        };
        _this = _super.call(this, props) || this;
        _this.currency = currency;
        _this.txStatus = tx.status;
        _this.block = block;
        _this.fee = tx.fee;
        _this.isFailed = !_this.txStatus;
        return _this;
    }
    SolTransaction.prototype.getNetworkFee = function () {
        return new bignumber_js_1.default(this.fee);
    };
    return SolTransaction;
}(MultiEntriesTransaction_1.default));
exports.SolTransaction = SolTransaction;
exports.default = SolTransaction;
//# sourceMappingURL=SolanaTransaction.js.map