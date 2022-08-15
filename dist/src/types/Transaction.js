"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = (function () {
    function Transaction(props, block) {
        Object.assign(this, props);
        this.block = block;
        this.isFailed = false;
        this._allEntries = [];
    }
    Transaction.prototype.extractEntries = function () {
        if (!this._allEntries.length) {
            this._allEntries = this._extractEntries();
        }
        return this._allEntries;
    };
    Transaction.prototype.extractOutputEntries = function () {
        var entries = this.extractEntries();
        return entries.filter(function (e) { return e.amount.gte(0); });
    };
    Transaction.prototype.extractInputEntries = function () {
        var entries = this.extractEntries();
        return entries.filter(function (e) { return e.amount.lt(0); });
    };
    Transaction.prototype.extractRecipientAddresses = function () {
        return this.extractOutputEntries().map(function (t) { return t.address; });
    };
    Transaction.prototype.extractSenderAddresses = function () {
        return this.extractInputEntries().map(function (t) { return t.address; });
    };
    Transaction.prototype.extractAdditionalField = function () {
        return {};
    };
    Transaction.prototype.getExtraDepositData = function () {
        return {
            blockHash: this.block.hash,
            blockNumber: this.height,
            blockTimestamp: this.timestamp,
        };
    };
    return Transaction;
}());
exports.Transaction = Transaction;
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map