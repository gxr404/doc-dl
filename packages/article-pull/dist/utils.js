"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDir = void 0;
var fs = require("fs");
var path = require("path");
var createDir = function (imgDir) {
    return new Promise(function (resolve, reject) {
        mkDirs(imgDir, function (e) {
            if (e)
                reject(e);
            resolve(void 0);
        });
    }).catch(function (e) {
        console.log(e);
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
