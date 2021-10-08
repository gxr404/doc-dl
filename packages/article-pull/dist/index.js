"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bin = exports.run = void 0;
var fs = require("fs");
var readability_1 = require("@mozilla/readability");
var jsdom_1 = require("jsdom");
var TurndownService = require("turndown");
var puppeteer = require("puppeteer");
var mdImg = require("pull-md-img");
var article_turndown_1 = require("article-turndown");
var args_1 = require("./args");
var options_1 = require("./options");
var addExtendInfo = function (mdContent, options, article) {
    var title = options.title || article.title || '';
    if (title) {
        mdContent = "# " + title + "\n<!--page header-->\n\n" + mdContent + "\n\n<!--page footer-->\n- \u539F\u6587: " + options.url;
    }
    return mdContent;
};
var getDocument = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, html;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, puppeteer.launch()];
            case 1:
                browser = _a.sent();
                return [4, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4, page.goto(url, {
                        timeout: 0,
                        waitUntil: ['load', 'networkidle0']
                    })];
            case 3:
                _a.sent();
                return [4, page.$eval('html', function (node) { return node.outerHTML; })];
            case 4:
                html = (_a.sent()) || '';
                browser.close();
                return [2, html];
        }
    });
}); };
var run = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var turndownService, htmlContext, dom, newDom, reader, article, title, mdContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                turndownService = new TurndownService({
                    codeBlockStyle: 'fenced'
                });
                turndownService.use((0, article_turndown_1.default)({
                    articleUrl: options.url
                }));
                console.log('----由于爬取页面可能为SPA页面需等待页面所有js请求都加载完毕后爬取该过程比较耗时,请耐心等待----');
                console.log('爬取页面中...');
                return [4, getDocument(options.url).catch(function (e) {
                        console.log(e);
                        return '';
                    })];
            case 1:
                htmlContext = _a.sent();
                console.log('√ 爬取页面');
                dom = new jsdom_1.JSDOM(htmlContext);
                newDom = dom.window.document.cloneNode(true);
                reader = new readability_1.Readability(newDom, {
                    keepClasses: true
                });
                article = reader.parse() || { title: options.title, content: '' };
                title = options.title || article.title;
                mdContent = turndownService.turndown(article.content);
                console.log('√ 转换markdown');
                mdContent = addExtendInfo(mdContent, options, article);
                return [4, mdImg.run(mdContent, {
                        path: '',
                        suffix: '',
                        dist: options.dist,
                        imgDir: "" + options.imgDir + Date.now(),
                        isIgnoreConsole: true
                    })];
            case 2:
                mdContent = _a.sent();
                console.log('√ 下载markdown中的图片');
                fs.writeFileSync(options.dist + "/" + title + ".md", mdContent);
                console.log('success');
                return [2];
        }
    });
}); };
exports.run = run;
var bin = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, args_1.shellArgsInit)();
                return [4, (0, exports.run)(options_1.default)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
exports.bin = bin;
