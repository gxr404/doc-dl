"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fixUrl = function (url, articleUrl) {
    if (!url) {
        return '';
    }
    var urlObj = new URL(articleUrl);
    if (url.startsWith('//')) {
        return "" + urlObj.protocol + url;
    }
    if (url.startsWith('/')) {
        return "" + urlObj.origin + url;
    }
    return url;
};
var codeBlock = function (code, language) {
    var languageString = language;
    if (typeof language !== 'string') {
        languageString = '';
    }
    if (typeof code !== 'string' || !code) {
        return '';
    }
    return "```" + languageString + "\n" + code + "\n```\n\n";
};
var notEmptyIndex = function (data, index) {
    var expect = index;
    var start = 0;
    while (expect >= 0) {
        if (typeof data[start] === 'undefined') {
            expect = expect - 1;
            if (expect < 0) {
                return start;
            }
        }
        start = start + 1;
    }
    return start;
};
exports.default = {
    fixUrl: fixUrl,
    codeBlock: codeBlock,
    notEmptyIndex: notEmptyIndex
};
