"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
function default_1(options) {
    return function (turndownService) {
        turndownService.addRule('zhihuGif', {
            filter: function (node) {
                if (!(node instanceof Object)) {
                    return false;
                }
                if (node.tagName !== 'IMG') {
                    return false;
                }
                if (!node.getAttribute('class') || !node.getAttribute('data-thumbnail')) {
                    return false;
                }
                var className = node.getAttribute('class');
                if (className !== 'ztext-gif') {
                    return false;
                }
                return true;
            },
            replacement: function (_, node) {
                var src = node.getAttribute('data-thumbnail');
                if (src) {
                    var index = src.lastIndexOf('.');
                    src = src.slice(0, index).concat('.gif');
                    return "![](" + index_1.default.fixUrl(src, options.articleUrl) + ")\n";
                }
                return '';
            },
        });
    };
}
exports.default = default_1;
