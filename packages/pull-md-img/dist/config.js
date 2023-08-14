"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    path: '',
    suffix: '',
    dist: './res/',
    imgDir: "./img/".concat(Date.now()),
    mdImgReg: /!\[(.*?)\]\((.*?)\)/gm,
    isIgnoreConsole: false
};
exports.default = config;
