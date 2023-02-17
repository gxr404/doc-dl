"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var turndown_plugin_gfm_1 = require("turndown-plugin-gfm");
var lazyLoadImage_1 = require("./rules/lazyLoadImage");
var hexoCodeBlock_1 = require("./rules/hexoCodeBlock");
var noScript_1 = require("./rules/noScript");
var wechatCodeBlock_1 = require("./rules/wechatCodeBlock");
var ibmCodeBlock_1 = require("./rules/ibmCodeBlock");
var mediumCodeBlock_1 = require("./rules/mediumCodeBlock");
var csdnCodeBlock_1 = require("./rules/csdnCodeBlock");
var yuqueTableCard_1 = require("./rules/yuqueTableCard");
var mediumImage_1 = require("./rules/mediumImage");
var zhihuGif_1 = require("./rules/zhihuGif");
var gcoresGallery_1 = require("./rules/gcoresGallery");
var typoraCodeBlock_1 = require("./rules/typoraCodeBlock");
var juejinCodeBlock_1 = require("./rules/juejinCodeBlock");
var strong_1 = require("./rules/tag/strong");
var syntaxhighlighter_1 = require("./rules/syntaxhighlighter");
var infoq_code_1 = require("./rules/infoq_code");
var wechatCodeBlock_02_1 = require("./rules/wechatCodeBlock_02");
var genPlugin = function (options) {
    return function (turndownService) {
        turndownService.use([
            turndown_plugin_gfm_1.gfm,
            (0, lazyLoadImage_1.default)(options),
            hexoCodeBlock_1.default,
            noScript_1.default,
            wechatCodeBlock_1.default,
            wechatCodeBlock_02_1.default,
            ibmCodeBlock_1.default,
            mediumCodeBlock_1.default,
            csdnCodeBlock_1.default,
            yuqueTableCard_1.default,
            mediumImage_1.default,
            (0, zhihuGif_1.default)(options),
            gcoresGallery_1.default,
            typoraCodeBlock_1.default,
            juejinCodeBlock_1.default,
            strong_1.default,
            syntaxhighlighter_1.default,
            infoq_code_1.default,
        ]);
    };
};
exports.default = genPlugin;
