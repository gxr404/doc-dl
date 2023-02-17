"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(turndownService) {
    turndownService.addRule('gcoresGallery', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'FIGURE') {
                return false;
            }
            var className = node.className;
            if (typeof className !== 'string' || !className.includes('story_block-atomic-gallery')) {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            var _a, _b;
            if (!(node instanceof Object)) {
                return content;
            }
            var galleryItem = node.querySelectorAll('.gallery_item');
            if (!galleryItem || galleryItem.length <= 0) {
                return content;
            }
            var imageCount = galleryItem.length;
            var galleryIndex = (_a = node.querySelector('.gallery_indexOf')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('span');
            if (galleryIndex && galleryIndex[1]) {
                imageCount = parseInt(galleryIndex[1].textContent, 10) || galleryItem.length;
            }
            var title = (_b = node.querySelector('.story_caption')) === null || _b === void 0 ? void 0 : _b.textContent;
            var code = Array.from(galleryItem)
                .slice(0, imageCount)
                .map(function (o) {
                var _a, _b;
                var href = o.getAttribute('href');
                var gallery_imageCaption = (_a = o.querySelector('.gallery_imageCaption')) === null || _a === void 0 ? void 0 : _a.textContent;
                return "![".concat((_b = gallery_imageCaption !== null && gallery_imageCaption !== void 0 ? gallery_imageCaption : title) !== null && _b !== void 0 ? _b : '', "](").concat(href, ")");
            })
                .join('\n');
            return "".concat(code, "\n");
        },
    });
}
exports.default = default_1;
