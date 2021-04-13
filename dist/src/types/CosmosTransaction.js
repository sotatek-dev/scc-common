"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosTransaction = exports.TypeMsgSDK = exports.TypeMsg = exports.TypeTx = void 0;
var MultiEntriesTransaction_1 = require("./MultiEntriesTransaction");
exports.TypeTx = {
    StdTx: 'core/StdTx',
};
exports.TypeMsg = {
    MsgSend: 'bank/MsgSend',
    MsgMultiSend: 'bank/MsgMultiSend',
};
exports.TypeMsgSDK = {
    MsgSend: 'cosmos-sdk/MsgSend',
    MsgMultiSend: 'cosmos-sdk/MsgMultiSend',
};
var CosmosTransaction = (function (_super) {
    __extends(CosmosTransaction, _super);
    function CosmosTransaction(tx, outputs, inputs, block, lastNetworkBlockNumber) {
        var _this = this;
        var props = {
            outputs: outputs,
            inputs: inputs,
            block: block,
            lastNetworkBlockNumber: lastNetworkBlockNumber,
            txid: tx.txid,
        };
        _this = _super.call(this, props) || this;
        _this.memo = tx.memo;
        _this.gas = tx.gas;
        _this.txType = tx.txType;
        _this.fee = tx.fee;
        return _this;
    }
    CosmosTransaction.prototype.extractAdditionalField = function () {
        return {
            memo: this.memo,
        };
    };
    CosmosTransaction.prototype.getNetworkFee = function () {
        return this.fee;
    };
    return CosmosTransaction;
}(MultiEntriesTransaction_1.MultiEntriesTransaction));
exports.CosmosTransaction = CosmosTransaction;
exports.default = CosmosTransaction;
//# sourceMappingURL=CosmosTransaction.js.map