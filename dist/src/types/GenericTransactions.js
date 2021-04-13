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
exports.GenericTransactions = void 0;
var GenericTransactions = (function (_super) {
    __extends(GenericTransactions, _super);
    function GenericTransactions() {
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, Object.create(GenericTransactions.prototype));
        return _this;
    }
    GenericTransactions.prototype.groupByRecipients = function () {
        var result = new Map();
        this.forEach(function (tx) {
            var addresses = tx.extractRecipientAddresses();
            addresses.forEach(function (address) {
                if (!result.get(address)) {
                    result.set(address, new GenericTransactions());
                }
                result.get(address).push(tx);
            });
        });
        return result;
    };
    return GenericTransactions;
}(Array));
exports.GenericTransactions = GenericTransactions;
exports.default = GenericTransactions;
//# sourceMappingURL=GenericTransactions.js.map