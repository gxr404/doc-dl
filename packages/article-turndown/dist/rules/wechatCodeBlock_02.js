"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('wechatCodeBlock_02', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'SECTION') {
                return false;
            }
            if (!node.className.includes('code-snippet__github')) {
                return false;
            }
            if (!node.querySelector('pre') || node.querySelectorAll('code').length === 0) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var pre = node.querySelector('pre');
            var language = pre === null || pre === void 0 ? void 0 : pre.getAttribute('data-lang');
            var finalCode = Array.from(node.querySelectorAll('code'))
                .map(function (o) { return o.textContent; })
                .join('\n');
            if (language) {
                return "```".concat(language, "\n").concat(finalCode, "\n```\n\n");
            }
            return "```\n".concat(finalCode, "\n```\n\n");
        },
    });
}
exports.default = default_1;
