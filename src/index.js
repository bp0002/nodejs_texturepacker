"use strict";
exports.__esModule = true;
var fs = require("fs");
var read_1 = require("./read");
var path_1 = require("./pi_path/path");
var texture_packer_1 = require("./texture_packer");
var mergy_image_1 = require("./mergy_image");
function run(tasks) {
    console.log("ITexturePackTask \u5269\u4F59: " + tasks.length);
    var task = tasks.pop();
    if (task == undefined) {
        return Promise.resolve(null);
    }
    else if (task.active == false) {
        return run(tasks);
    }
    else {
        var texturepacker_1 = new texture_packer_1.TexturePacker(task, configPath);
        return texturepacker_1.run().then(function (_a) {
            var configs = _a[0], imageInfoMap = _a[1];
            var savePath = (0, path_1.formatUrl)(configPath, task.target);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }
            var saveConfigs = [];
            configs.forEach(function (item) {
                saveConfigs.push(item);
            });
            return packCall(configs, imageInfoMap, texturepacker_1, task.alignSize, task.logMergy).then(function () {
                return new Promise(function (resolve, reject) {
                    fs.writeFile("" + savePath + task.name + ".atlas", JSON.stringify(saveConfigs), "utf-8", function () {
                        console.log("Task " + task.name + " End.");
                        resolve(null);
                    });
                }).then(function () {
                    return run(tasks);
                });
            });
        });
    }
}
function packCall(configs, imageInfoMap, texturepacker, alignSize, logMergy) {
    var config = configs.pop();
    if (config) {
        return (0, mergy_image_1.mergyByTexturePacker)(imageInfoMap, config, texturepacker.srcPath, config.image, alignSize, logMergy).then(function () {
            config.image = config.image.replace(/(.*)src\//, "");
            console.log("Image Pack End: " + config.image);
            return packCall(configs, imageInfoMap, texturepacker, alignSize, logMergy);
        });
    }
    else {
        return Promise.resolve(null);
    }
}
var configPath = process.argv[2];
var idx;
if (process.argv[3] != undefined) {
    idx = process.argv[3] - 0;
}
if (configPath) {
    (0, read_1.readJson)(configPath).then(function (val) {
        if (idx != undefined && !Number.isNaN(idx) && val.length > idx) {
            return run([val[idx]]);
        }
        else {
            return run(val);
        }
    }).then(function () {
        console.log("Tasks Finish!!");
    });
}
