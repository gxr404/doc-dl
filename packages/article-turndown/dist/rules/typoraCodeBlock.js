"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
function default_1(turndownService) {
    turndownService.addRule('mediumCodeBlock', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'PRE') {
                return false;
            }
            if (!node.className.includes('contain-cm')) {
                return false;
            }
            var firstChild = node.firstChild;
            if (!(firstChild instanceof HTMLElement)) {
                return false;
            }
            if (!firstChild.className.includes('CodeMirror')) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var codeMirrorLines = node.querySelectorAll('.CodeMirror-line');
            if (!codeMirrorLines || codeMirrorLines.length === 0) {
                return '';
            }
            var code = Array.from(codeMirrorLines)
                .map(function (o) { return o.textContent; })
                .join('\n');
            var lang = node.getAttribute('lang');
            return index_1.default.codeBlock(code, lang);
        }
    });
}
exports.default = default_1;
