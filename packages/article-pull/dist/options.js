"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.puppeteerOptions = exports.options = void 0;
exports.options = {
    url: '',
    title: '',
    dist: './res',
    imgDir: './img/',
};
var UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
exports.puppeteerOptions = {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        "--user-agent=".concat(UA)
    ],
    headless: true,
    ignoreHTTPSErrors: true
};
