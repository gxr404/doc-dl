"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
function default_1(options) {
    return function (turndownService) {
        turndownService.addRule('lazyLoadImage', {
            filter: ['img'],
            replacement: function (_, node) {
                var attributes = ['data-src', 'data-original-src'];
                for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                    var attribute = attributes_1[_i];
                    var dataSrc = node.getAttribute(attribute);
                    if (dataSrc) {
                        return "![](".concat(index_1.default.fixUrl(dataSrc, options.articleUrl), ")\n");
                    }
                }
                var src = node.getAttribute('src');
                if (src) {
                    return "![](".concat(index_1.default.fixUrl(node.getAttribute('src'), options.articleUrl), ")\n");
                }
                return '';
            },
        });
    };
}
exports.default = default_1;
