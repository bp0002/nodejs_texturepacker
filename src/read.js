"use strict";
exports.__esModule = true;
exports.collectFiles = exports.collectDirs = exports.readJson = void 0;
var fs = require("fs");
function readJson(cfgPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                // console.error(err);
                reject(err);
            }
            else {
                var json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}
exports.readJson = readJson;
function collectDirs(checkDirs, dirList) {
    if (checkDirs.length == 0) {
        return Promise.resolve(null);
    }
    else {
        var promises_1 = [];
        var tempDir_1 = [];
        checkDirs.forEach(function (dir) {
            promises_1.push(new Promise(function (resolve, reject) {
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        console.error("Read Dir Error: " + err);
                        resolve(null);
                    }
                    else {
                        var list_1 = [];
                        files.forEach(function (file) {
                            var path = "" + dir + file;
                            list_1.push(new Promise(function (resolve, reject) {
                                fs.stat(path, function (err, stats) {
                                    if (err) {
                                        console.error("Read stat Error: " + err);
                                    }
                                    else {
                                        if (stats.isDirectory()) {
                                            dirList.push([dir, file]);
                                            tempDir_1.push(path + "/");
                                        }
                                    }
                                    resolve(null);
                                });
                            }));
                        });
                        Promise.all(list_1).then(function () {
                            resolve(null);
                        })["catch"](reject);
                    }
                });
            }));
        });
        return Promise.all(promises_1);
    }
}
exports.collectDirs = collectDirs;
function collectFiles(checkDirs, dirList, fileList) {
    if (checkDirs.length == 0) {
        return Promise.resolve(null);
    }
    else {
        var promises_2 = [];
        var tempDir_2 = [];
        checkDirs.forEach(function (dir) {
            promises_2.push(new Promise(function (resolve, reject) {
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        console.error("Read Dir Error: " + err);
                        resolve(null);
                    }
                    else {
                        var list_2 = [];
                        files.forEach(function (file) {
                            var path = "" + dir + file;
                            list_2.push(new Promise(function (resolve, reject) {
                                fs.stat(path, function (err, stats) {
                                    if (err) {
                                        console.error("Read stat Error: " + err);
                                    }
                                    else {
                                        if (stats.isDirectory()) {
                                            dirList.push([dir, file]);
                                            tempDir_2.push(path + "/");
                                        }
                                        else {
                                            fileList.push([dir, file]);
                                        }
                                    }
                                    resolve(null);
                                });
                            }));
                        });
                        Promise.all(list_2).then(function () {
                            resolve(null);
                        })["catch"](reject);
                    }
                });
            }));
        });
        return Promise.all(promises_2).then(function () {
            // console.log(tempDir);
            return collectFiles(tempDir_2, dirList, fileList);
        });
    }
}
exports.collectFiles = collectFiles;
