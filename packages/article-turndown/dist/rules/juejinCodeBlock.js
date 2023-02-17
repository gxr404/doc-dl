"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('juejinCodeBlock', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'PRE') {
                return false;
            }
            if (node.className === 'prettyprint') {
                return false;
            }
            var child = node.firstChild;
            if (!child) {
                return false;
            }
            if (child.tagName !== 'CODE') {
                return false;
            }
            if (!child.className.includes('hljs')) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            var _a, _b, _c;
            if (!(node instanceof Object)) {
                return content;
            }
            (_a = node.querySelector('.copy-code-btn')) === null || _a === void 0 ? void 0 : _a.remove();
            return "```".concat((_b = node.firstChild) === null || _b === void 0 ? void 0 : _b.getAttribute('lang'), "\n").concat((_c = node.firstChild) === null || _c === void 0 ? void 0 : _c.textContent, "\n```\n\n");
        },
    });
}
exports.default = default_1;
