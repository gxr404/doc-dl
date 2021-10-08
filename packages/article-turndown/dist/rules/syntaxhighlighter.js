"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('syntaxhighlighter', {
        filter: function (node) {
            var _a;
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'TABLE') {
                return false;
            }
            var hasCss = !((_a = node.className) === null || _a === void 0 ? void 0 : _a.includes('syntaxhighlighter'));
            if (!hasCss) {
                return false;
            }
            if (!node.querySelector('.code') || !node.querySelector('.container')) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            var _a;
            if (!(node instanceof Object)) {
                return content;
            }
            var lines = ((_a = node.querySelector('.container')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('line')) || [];
            var finalCode = Array.from(lines)
                .map(function (o) { return o.textContent; })
                .join('\n');
            return "```\n" + finalCode + "\n```\n\n";
        },
    });
}
exports.default = default_1;
