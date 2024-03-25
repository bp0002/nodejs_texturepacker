"use strict";
exports.__esModule = true;
var fs = require("fs");
var savepath = "./cfg/";
function colllect(dirPath) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dirPath, function (err, files) {
            if (err) {
                console.log('获取文件文件夹信息失败');
                reject('获取文件文件夹信息失败');
            }
            var str = '[\r\n';
            var len = files.length;
            for (var i = 0; i < len; i++) {
                str += "\"" + files[i] + "\"";
                if (i < len - 1) {
                    str += ',';
                }
                str += '\r\n';
            }
            str += ']';
            fs.writeFile(savepath + "files.json", str, { encoding: "utf-8" }, function () {
                console.log('保存成功');
            });
            resolve(undefined);
        });
    });
}
colllect("./images/");
