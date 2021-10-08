"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeFileName = exports.getFileSate = exports.readFile = exports.checkProtocol = exports.replaceSpecialReg = exports.createDir = exports.changeSuffix = void 0;
var fs = require("fs");
var path = require("path");
var url = require("url");
var http = require("http");
var https = require("https");
var log_1 = require("./log");
var logger = (0, log_1.default)();
var changeSuffix = function (pathSrc, suffix) {
    var pathObj = path.parse(pathSrc);
    return pathObj.dir + "/" + pathObj.name + "." + suffix;
};
exports.changeSuffix = changeSuffix;
var createDir = function (imgDir) {
    return new Promise(function (resolve, reject) {
        mkDirs(imgDir, function (e) {
            if (e)
                reject(e);
            resolve(void 0);
        });
    }).catch(function (e) {
        logger.error('mkdir error', e);
    });
};
exports.createDir = createDir;
var mkDirs = function (dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback(null);
        }
        else {
            mkDirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
};
var replaceSpecialReg = function (str) {
    var ESCAPE_RE = /[-.*+?^${}()|[\]/\\]/g;
    var res = str.replace(ESCAPE_RE, '\\$&');
    res = res.replace('!\\[', '!\\[(').replace('\\]', ')\\]');
    return res;
};
exports.replaceSpecialReg = replaceSpecialReg;
var checkProtocol = function (inputUrl) {
    var urlObj = url.parse(inputUrl);
    var protocol = urlObj.protocol;
    return protocol === 'http:' ? http : https;
};
exports.checkProtocol = checkProtocol;
var readFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err)
                reject(err);
            resolve(data);
        });
    }).catch(function (e) {
        logger.error(e);
    });
};
exports.readFile = readFile;
var getFileSate = function (path) {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stat) {
            if (err) {
                reject(err);
            }
            resolve(stat);
        });
    }).catch(function (e) {
        logger.error(e);
    });
};
exports.getFileSate = getFileSate;
var changeFileName = function (pathSrc) {
    var pathObj = path.parse(pathSrc);
    return pathObj.dir + "/" + pathObj.name + "-" + ~~(Math.random() * 1000000) + pathObj.ext;
};
exports.changeFileName = changeFileName;
