"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('noscript', {
        filter: ['noscript'],
        replacement: function () {
            return "";
        },
    });
}
exports.default = default_1;
