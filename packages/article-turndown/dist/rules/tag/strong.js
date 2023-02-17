"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('tag_string', {
        filter: ['b', 'strong'],
        replacement: function (content) {
            if (typeof content !== 'string' || !content.trim()) {
                return '';
            }
            var result = content.trim();
            if (['：', '】', '▐', '。'].some(function (o) { return result.endsWith(o); })) {
                return "**".concat(result, "** ");
            }
            return "**".concat(result, "**");
        },
    });
}
exports.default = default_1;
