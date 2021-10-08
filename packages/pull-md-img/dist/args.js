"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shellArgsInit = void 0;
var path = require("path");
var commander_1 = require("commander");
var log_1 = require("./log");
var config_1 = require("./config");
var packageJson = require("../package.json");
var logger = (0, log_1.default)();
var shellArgsInit = function () {
    var program = new commander_1.Command();
    program
        .version(packageJson.version)
        .option('-p, --path <path>', 'markdown 目标文件')
        .option('-s, --suffix <suffix>', '需要更改下载的图片的后缀的话 后缀(eg: -s jpg)')
        .option('-d, --dir <path>', '生成的目录(eg: -d res)')
        .option('-i, --img-dir <path>', '生成目录内图片目录(eg: -i ./img/20)');
    program.on('--help', function () {
        console.log('');
        console.log('Examples:');
        console.log('  $ custom-help --help');
        console.log('  $ custom-help -h');
    });
    program.parse(process.argv);
    var programOpt = program.opts();
    var argsKey = Object.keys(config_1.default);
    var shellArgs = {};
    argsKey.forEach(function (key) {
        if (checkOptions(programOpt[key], key)) {
            shellArgs[key] = programOpt[key];
        }
    });
    Object.assign(config_1.default, shellArgs);
    if (!config_1.default.path) {
        logger.error('-p, --path <path> 必须！');
        process.exitCode = 1;
        process.exit(1);
    }
};
exports.shellArgsInit = shellArgsInit;
var checkOptions = function (val, key) {
    if (!val)
        return false;
    if (typeof val === 'string' && val.trim() === '')
        return false;
    if (val.indexOf('-') === 0)
        return false;
    if (key === 'path' && !checkSuffix(val))
        return false;
    return true;
};
var checkSuffix = function (pathArg) {
    var suffix = ['.md'];
    var targetSuffix = path.extname(pathArg);
    if (suffix.indexOf(targetSuffix) < 0) {
        logger.error('非法文件后缀~  o(╥﹏╥)o');
        return false;
    }
    return true;
};
