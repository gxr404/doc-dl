"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('wechatCodeBlock', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'SECTION') {
                return false;
            }
            if (!node.className || !node.className.includes('code-snippet__js')) {
                return false;
            }
            var pre = node.querySelector('pre.code-snippet__js');
            if (!pre) {
                return false;
            }
            var language = pre.getAttribute('data-lang');
            if (!language) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var pre = node.querySelector('pre.code-snippet__js');
            var language = pre.getAttribute('data-lang');
            var finalCode = Array.from(pre.querySelectorAll('code'))
                .map(function (o) { return o.textContent; })
                .join('\n');
            return "```" + language + "\n" + finalCode + "\n```\n\n";
        },
    });
}
exports.default = default_1;
