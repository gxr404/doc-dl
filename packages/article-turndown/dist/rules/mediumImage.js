"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('mediumImage', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'IMG') {
                return false;
            }
            if (!node.getAttribute('src') || !node.getAttribute('height') || !node.getAttribute('width')) {
                return false;
            }
            var src = node.getAttribute('src');
            if (!src.startsWith('https://miro.medium.com/max/')) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var src = node.getAttribute('src');
            var width = node.getAttribute('width');
            var result = src.replace(/https:\/\/miro.medium.com\/max\/(\d*)\//, "https://miro.medium.com/max/" + Number(width) * 2 + "/");
            return "![](" + result + ")";
        },
    });
}
exports.default = default_1;
