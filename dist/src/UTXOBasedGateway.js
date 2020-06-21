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
var BaseGateway_1 = require("./BaseGateway");
var UTXOBasedGateway = (function (_super) {
    __extends(UTXOBasedGateway, _super);
    function UTXOBasedGateway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UTXOBasedGateway.prototype.validateRawTx = function (rawTx) {
        var tx = this.reconstructRawTx(rawTx.unsignedRaw);
        return tx.txid === rawTx.txid && tx.unsignedRaw === rawTx.unsignedRaw;
    };
    return UTXOBasedGateway;
}(BaseGateway_1.BaseGateway));
exports.UTXOBasedGateway = UTXOBasedGateway;
//# sourceMappingURL=UTXOBasedGateway.js.map