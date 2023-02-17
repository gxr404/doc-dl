"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var getLogger = function () {
    log4js.configure({
        appenders: {
            cheese: {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: '%[%c [%p]:%] %m%n'
                }
            }
        },
        categories: { default: { appenders: ['cheese'], level: 'trace' } }
    });
    return log4js.getLogger('mdDownloadImg');
};
exports.default = (function () {
    var logger;
    return function () {
        if (logger)
            return logger;
        logger = getLogger();
        return logger;
    };
})();
