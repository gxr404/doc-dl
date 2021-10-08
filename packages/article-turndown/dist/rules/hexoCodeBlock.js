"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('hexoCodeBlock', {
        filter: ['figure', 'table'],
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var language = '';
            if (node.tagName === 'FIGURE') {
                var className = node.getAttribute('class');
                if (className) {
                    var match = className.match(/highlight (.*)/);
                    if (match) {
                        language = match[1];
                    }
                }
            }
            var gutter = node.querySelector('.gutter');
            var code = node.querySelector('td.code');
            if (!code || !gutter) {
                return content;
            }
            var codeArray = Array.from(code.querySelectorAll('.line'));
            if (!Array.isArray(codeArray)) {
                return content;
            }
            var finalCode = codeArray.map(function (o) { return o.textContent; }).join('\n');
            return "```" + language + "\n" + finalCode + "\n```\n\n";
        },
    });
}
exports.default = default_1;
