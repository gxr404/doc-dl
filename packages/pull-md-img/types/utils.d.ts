/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
declare const changeSuffix: (pathSrc: string, suffix: string) => string;
declare const createDir: (imgDir: string) => Promise<any>;
declare const replaceSpecialReg: (str: string) => string;
declare const checkProtocol: (inputUrl: string) => typeof http | typeof https;
declare const readFile: (filePath: string) => Promise<any>;
declare const getFileSate: (path: string) => Promise<any>;
declare const changeFileName: (pathSrc: string) => string;
export { changeSuffix, createDir, replaceSpecialReg, checkProtocol, readFile, getFileSate, changeFileName };
