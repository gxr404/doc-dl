"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('mediumCodeBlock', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'PRE') {
                return false;
            }
            if (!node.className) {
                return false;
            }
            var codeLine = node.querySelectorAll('span[data-selectable-paragraph]');
            if (!codeLine) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            return "```\n" + content + "\n```\n\n";
        },
    });
}
exports.default = default_1;
