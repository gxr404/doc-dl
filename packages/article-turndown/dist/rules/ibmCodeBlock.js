"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('wechatCodeBlock', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'DIV') {
                return false;
            }
            if (!node.className || !node.className.includes('syntaxhighlighter')) {
                return false;
            }
            var code = node.querySelector('div.container');
            if (!code) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var codeNode = node.querySelector('div.container');
            var finalCode = Array.from(codeNode.querySelectorAll('.line'))
                .map(function (o) { return o.textContent; })
                .join('\n');
            return "```\n" + finalCode + "\n```\n\n";
        },
    });
}
exports.default = default_1;
