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
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("./Transaction");
var TransferEntry_1 = require("./TransferEntry");
var AccountBasedTransaction = (function (_super) {
    __extends(AccountBasedTransaction, _super);
    function AccountBasedTransaction(currency, tx, block) {
        var _this = this;
        var txProps = {
            confirmations: tx.confirmations,
            height: block.number,
            timestamp: new Date(block.timestamp).getTime(),
            txid: tx.txid,
        };
        _this = _super.call(this, txProps, block) || this;
        _this.currency = currency;
        _this.fromAddress = tx.fromAddress;
        _this.toAddress = tx.toAddress;
        _this.amount = tx.amount;
        return _this;
    }
    AccountBasedTransaction.prototype._extractEntries = function () {
        if (this.amount.isZero()) {
            return [];
        }
        var senderEntry = new TransferEntry_1.TransferEntry({
            currency: this.currency,
            amount: this.amount.times(-1),
            address: this.fromAddress,
            tx: this,
            txid: this.txid,
        });
        var receiverEntry = new TransferEntry_1.TransferEntry({
            currency: this.currency,
            amount: this.amount,
            address: this.toAddress,
            tx: this,
            txid: this.txid,
        });
        return [senderEntry, receiverEntry];
    };
    return AccountBasedTransaction;
}(Transaction_1.Transaction));
exports.AccountBasedTransaction = AccountBasedTransaction;
//# sourceMappingURL=AccountBasedTransaction.js.map