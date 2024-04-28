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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.run = exports.bin = void 0;
var fs = require("fs");
var path = require("path");
var url = require("url");
var progressBar = require("progress");
var log_1 = require("./log");
var config_1 = require("./config");
var args_1 = require("./args");
var randUserAgent = require("rand-user-agent");
var mime = require("mime-types");
var utils_1 = require("./utils");
var logger = (0, log_1.default)();
var getImgList = function (data) {
    var list = Array.from(data.match(config_1.default.mdImgReg) || []);
    list = list
        .map(function (itemUrl) {
        itemUrl = itemUrl.replace(config_1.default.mdImgReg, '$2');
        if (!/^http.*/g.test(itemUrl))
            return '';
        var itemUrlObj = new url.URL(itemUrl);
        itemUrl = url.format(itemUrlObj, {
            fragment: false,
            unicode: false,
            auth: false,
            search: false
        });
        return itemUrl;
    })
        .filter(function (url) { return Boolean(url); });
    var resSet = new Set(list);
    list = Array.from(resSet);
    return list;
};
var downloadImg = function (url, imgDir) {
    var fileName = path.basename(url);
    fileName = fileName.replace(/(\?.*)|(#.*)/g, '');
    fileName = (0, utils_1.changeFileName)(fileName);
    if (config_1.default.suffix)
        fileName = (0, utils_1.changeSuffix)(fileName, config_1.default.suffix);
    var lib = (0, utils_1.checkProtocol)(url);
    return new Promise(function (resolve, reject) {
        var req = lib.request(url, {
            headers: {
                'user-agent': randUserAgent('desktop', 'chrome')
            }
        }, function (res) {
            var isExt = path.parse(fileName).ext;
            var contentType = res.headers['content-type'];
            if (!isExt) {
                var fileSuffix = mime.extension(contentType);
                if (fileSuffix)
                    fileName = (0, utils_1.changeSuffix)(fileName, fileSuffix);
            }
            var isRedirect = [302, 301].indexOf(res.statusCode);
            if (~isRedirect) {
                if (!config_1.default.isIgnoreConsole) {
                    logger.info("".concat(fileName, " \u91CD\u5B9A\u5411..."));
                }
                resolve(downloadImg(res.headers['location'], imgDir));
                return;
            }
            var contentLength = parseInt(res.headers['content-length'], 10);
            var distPath = "".concat(imgDir, "/").concat(fileName);
            var out = fs.createWriteStream(distPath);
            var disableProgressBar = isNaN(contentLength);
            var bar = new progressBar("downloading ".concat(fileName, " [:bar] :rate/bps :percent :etas"), {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: contentLength
            });
            res.on('data', function (chunk) {
                out.write(chunk, function () {
                    if (!config_1.default.isIgnoreConsole && !disableProgressBar) {
                        bar.tick(chunk.length);
                    }
                });
            });
            res.on('end', function () {
                resolve(distPath);
            });
        });
        req.on('error', function (e) {
            if (!config_1.default.isIgnoreConsole) {
                logger.error("download ".concat(url, " error"));
                logger.error(e);
            }
            reject({
                error: e,
                url: url
            });
        });
        req.end();
    });
};
var changeMarkdown = function (data, imgList) {
    var newImgList = imgList.map(function (src) {
        if (config_1.default.suffix)
            src = (0, utils_1.changeSuffix)(src, config_1.default.suffix);
        var fileName = path.basename(src);
        return "".concat(config_1.default.imgDir, "/").concat(fileName);
    });
    var newData = data;
    var list = data.match(config_1.default.mdImgReg) || [];
    list.forEach(function (src, index) {
        if (/.*\]\(http.*/g.test(src)) {
            var imgReg = new RegExp((0, utils_1.replaceSpecialReg)(src), 'gm');
            newData = newData.replace(imgReg, '![$1](' + newImgList[index] + ')');
        }
    });
    return newData;
};
var bin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, newData, fileName, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, args_1.shellArgsInit)();
                return [4, (0, utils_1.readFile)(config_1.default.path)];
            case 1:
                data = _a.sent();
                if (!data) {
                    logger.error('o(╥﹏╥)o 读取失败');
                    return [2];
                }
                return [4, (0, exports.run)(data, config_1.default)];
            case 2:
                newData = _a.sent();
                fileName = path.basename(config_1.default.path);
                out = fs.createWriteStream(path.resolve(config_1.default.dist, fileName));
                out.write(newData);
                setTimeout(function () {
                    logger.info('success');
                }, 100);
                return [2];
        }
    });
}); };
exports.bin = bin;
var run = function (data, customConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var dirNameReg, imgList, imgDirPath, imgListPromise, resList, newData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Object.assign(config_1.default, customConfig);
                dirNameReg = /[:*?"<>|\n\r]/g;
                config_1.default.dist = config_1.default.dist.replace(dirNameReg, '_').replace(/\s/g, '');
                config_1.default.imgDir = config_1.default.imgDir.replace(dirNameReg, '_').replace(/\s/g, '');
                imgList = getImgList(data);
                if (!imgList.length) {
                    return [2, data];
                }
                imgDirPath = path.resolve(config_1.default.dist, config_1.default.imgDir);
                return [4, (0, utils_1.createDir)(imgDirPath)];
            case 1:
                _a.sent();
                imgListPromise = imgList.map(function (src) {
                    return downloadImg(src, imgDirPath);
                });
                return [4, Promise.all(imgListPromise)];
            case 2:
                resList = _a.sent();
                newData = changeMarkdown(data, resList);
                return [2, newData];
        }
    });
}); };
exports.run = run;
