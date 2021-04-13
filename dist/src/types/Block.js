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
exports.Block = void 0;
var BlockHeader_1 = require("./BlockHeader");
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(props, txids) {
        var _this = _super.call(this, props) || this;
        _this.txids = txids;
        return _this;
    }
    return Block;
}(BlockHeader_1.BlockHeader));
exports.Block = Block;
exports.default = Block;
//# sourceMappingURL=Block.js.map