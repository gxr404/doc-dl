"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shellArgsInit = void 0;
var commander_1 = require("commander");
var packageJson = require("../package.json");
var options_1 = require("./options");
var shellArgsInit = function () {
    var program = new commander_1.Command();
    program
        .version(packageJson.version)
        .option('-u, --url <url>', '文章url')
        .option('-t, --title <title>', '自定义文章标题')
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
    var argsKey = Object.keys(options_1.default);
    var shellArgs = {};
    argsKey.forEach(function (key) {
        if (checkOptions(programOpt[key], key)) {
            shellArgs[key] = programOpt[key];
        }
    });
    Object.assign(options_1.default, shellArgs);
    if (!options_1.default.url) {
        console.error('-u, --url <url> 必须！');
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
    if (key === 'url' && !checkUrl(val)) {
        console.log('非合法url');
        return false;
    }
    return true;
};
var checkUrl = function (href) {
    var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
    return reg.test(href);
};
