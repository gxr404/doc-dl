"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('csdnCodeBlock', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'PRE') {
                return false;
            }
            if (node.className !== 'prettyprint') {
                return false;
            }
            var codeLine = node.querySelectorAll('code');
            if (!codeLine) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            var _a;
            if (!(node instanceof Object)) {
                return content;
            }
            (_a = node.querySelector('.pre-numbering')) === null || _a === void 0 ? void 0 : _a.remove();
            var codeBlock = node.querySelector('code');
            var code = codeBlock.textContent;
            var language = '';
            var languageMatchResult = codeBlock.className.match(/language-(.*) /);
            if (languageMatchResult) {
                language = languageMatchResult[1];
            }
            language = language.split(' ')[0];
            return "```".concat(language, "\n").concat(code, "\n```\n\n");
        },
    });
}
exports.default = default_1;
