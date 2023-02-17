"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('infoq_code', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'DIV') {
                return false;
            }
            if (node.getAttribute('data-type') !== 'codeblock') {
                return false;
            }
            if (!node.querySelector('.simplebar') || !node.querySelector('[data-origin=pm_code_preview]')) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            var _a;
            if (!(node instanceof Object)) {
                return content;
            }
            var lines = (_a = node.querySelectorAll('[data-type=codeline]')) !== null && _a !== void 0 ? _a : [];
            var finalCode = Array.from(lines)
                .map(function (o) { return o.textContent; })
                .join('\n')
                .trim();
            return "```\n".concat(finalCode, "\n```\n\n");
        },
    });
}
exports.default = default_1;
