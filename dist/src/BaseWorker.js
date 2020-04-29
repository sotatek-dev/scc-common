"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var logger = Logger_1.getLogger('BaseWorker');
var BaseWorker = (function () {
    function BaseWorker() {
        this._isStarted = false;
    }
    BaseWorker.prototype.start = function () {
        var _this = this;
        if (this._isStarted) {
            logger.warn("Trying to start processor twice: " + this.constructor.name);
            return;
        }
        this._isStarted = true;
        this.prepare()
            .then(function (res) {
            logger.info(_this.constructor.name + " finished preparing. Will start the first tick shortly...");
            _this.onTick();
        })
            .catch(function (err) {
            throw err;
        });
    };
    BaseWorker.prototype.onTick = function () {
        var _this = this;
        this.doProcess().catch(function (err) {
            logger.error("======================================================================================");
            logger.error(err);
            logger.error(_this.constructor.name + " something went wrong. The worker will be restarted shortly...");
            logger.error("======================================================================================");
            setTimeout(function () {
                _this.onTick();
            }, 30000);
        });
    };
    return BaseWorker;
}());
exports.BaseWorker = BaseWorker;
exports.default = BaseWorker;
//# sourceMappingURL=BaseWorker.js.map