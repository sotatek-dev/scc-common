"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferEntry = void 0;
var lodash_1 = __importDefault(require("lodash"));
var TransferEntry = (function () {
    function TransferEntry(props) {
        Object.assign(this, props);
    }
    TransferEntry.mergeEntries = function (entries) {
        var result = [];
        entries = lodash_1.default.compact(entries);
        entries.map(function (entry) {
            var item = result.find(function (i) { return i.address === entry.address; });
            if (!item) {
                result.push(entry);
                return;
            }
            var itemIndex = result.findIndex(function (i) { return i.address === entry.address; });
            result.splice(itemIndex, 1);
            var amount = entry.amount.plus(item.amount);
            var newEntry = Object.assign({}, entry, { amount: amount });
            result.push(newEntry);
        });
        return result;
    };
    return TransferEntry;
}());
exports.TransferEntry = TransferEntry;
exports.default = TransferEntry;
//# sourceMappingURL=TransferEntry.js.map