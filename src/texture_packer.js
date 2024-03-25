"use strict";
exports.__esModule = true;
exports.TexturePacker = exports.maxrectspacker_to_texturepacker = exports.texturepacker = void 0;
var read_1 = require("./read");
var maxrects_packer_1 = require("maxrects-packer");
var path_1 = require("./pi_path/path");
var image_collect_1 = require("./image_collect");
function commandline(exePath, spirtFolder, outputDir, outputName) {
    var result = "\nSET \"PATH=" + exePath + ";%PATH%\" & TexturePacker --format pixijs --multipack --disable-rotation --sheet " + outputDir + outputName + "_{n1}.png --data " + outputDir + outputName + "_{n1}.json " + spirtFolder + "\n";
    return result;
}
function texturepacker(exePath, spirtFolder, outputDir, outputName) {
    return new Promise(function (resolve, reject) {
        var cmd = commandline(exePath, spirtFolder, outputDir, outputName);
        console.log(cmd);
        resolve(null);
        // let exe = spawn(cmd);
        // // , (error, stdout, stderr) => {
        // //     console.error(`${error}`);
        // //     console.error(stdout);
        // //     console.error(stderr);
        // //     console.warn(`TexturePacker End.`);
        // //     return readJson(`${outputDir}${outputName}.json`).then(resolve).catch(reject);
        // // });
        // exe.on("close", () => {
        //     console.warn(`TexturePacker End.`);
        //     return readJson(`${outputDir}${outputName}.json`).then(resolve).catch(reject);
        // });
        // exe.on("error", (err) => {
        //     console.warn(`TexturePacker Err. ${err}`);
        //     reject(err);
        // });
    });
}
exports.texturepacker = texturepacker;
function maxrectspacker_to_texturepacker(bin, urlClip, image, trimmed) {
    var result = {
        frames: {},
        meta: {
            app: "pi_texturepacker",
            version: "",
            image: "",
            format: "",
            size: { w: bin.width, h: bin.height },
            smartupdate: ""
        },
        image: image
    };
    bin.rects.forEach(function (element) {
        var key = element.key.replace(urlClip, "");
        result.frames[key] = {
            frame: { x: element.x, y: element.y, w: element.width, h: element.height },
            rotated: !!element.rot,
            trimmed: trimmed,
            spriteSourceSize: element.spriteSourceSize,
            sourceSize: element.sourceSize
        };
    });
    return result;
}
exports.maxrectspacker_to_texturepacker = maxrectspacker_to_texturepacker;
var TexturePacker = /** @class */ (function () {
    function TexturePacker(task, configPath) {
        this.task = task;
        this.configPath = configPath;
        this.animations = new Map();
        var path = (0, path_1.formatUrl)(configPath, task.srcDir);
        console.log("srcDir: " + path);
        console.log("target: " + (0, path_1.formatUrl)(configPath, task.target));
        console.log("Name: " + task.name + " }");
    }
    Object.defineProperty(TexturePacker.prototype, "srcPath", {
        get: function () {
            return (0, path_1.formatUrl)(this.configPath, this.task.srcDir);
        },
        enumerable: false,
        configurable: true
    });
    TexturePacker.prototype.run = function () {
        var _this = this;
        var task = this.task;
        var srcPath = (0, path_1.formatUrl)(this.configPath, task.srcDir);
        var savePath = (0, path_1.formatUrl)(this.configPath, task.target);
        var map = new Map();
        if (task.subFolders) {
            var files = [];
            var dirs_1 = [];
            return (0, read_1.collectDirs)([srcPath], dirs_1).then(function () {
                // console.log(dirs);
                // console.log(files);
                var promise = [];
                dirs_1.forEach(function (dir) {
                    var key = dir[1];
                    var path = "" + dir[0] + dir[1] + "/";
                    promise.push(_this.collectFolderImageInfos(_this.task, path).then(function (collect) {
                        _this.animations.set(key, collect);
                        collect.imageContextInfos.forEach(function (element, key) {
                            map.set(key, element);
                        });
                    }));
                });
                return Promise.all(promise).then(function () {
                    var atlas = _this.pack(task, _this.animations, srcPath, savePath, true);
                    return [atlas, map];
                });
            });
        }
        else {
            return this.collectFolderImageInfos(this.task, srcPath).then(function (imageCollect) {
                _this.animations.set(srcPath, imageCollect);
                imageCollect.imageContextInfos.forEach(function (element, key) {
                    map.set(key, element);
                });
                var atlas = _this.pack(task, _this.animations, srcPath, savePath, false);
                return [atlas, map];
            });
        }
    };
    TexturePacker.prototype.collectFolderImageInfos = function (task, path) {
        var files = [];
        var dirs = [];
        var imageCollect = new image_collect_1.ImageCollect();
        return (0, read_1.collectFiles)([path], dirs, files).then(function () {
            // console.log(dirs);
            // console.log(files);
            var promise = [];
            files.forEach(function (file) {
                var path = "" + file[0] + file[1];
                if (task.logCollect) {
                    console.log("Collecting: " + path);
                }
                if (path.endsWith(".png") || path.endsWith(".jpg")) {
                    promise.push(imageCollect.query(path, path, task.trim, task.logTrim));
                }
            });
            return Promise.all(promise).then(function () {
                console.log("Collected: " + path + " Collect Count: " + imageCollect.imageContextInfos.size);
                return imageCollect;
            })["catch"](function (err) {
                console.error("Collect Error: " + err);
            });
        });
    };
    TexturePacker.prototype.pack = function (task, images, srcPath, savePath, anime) {
        var options = {
            smart: true,
            pot: false,
            square: task.square,
            allowRotation: task.rotation,
            tag: task.useTag,
            border: task.border == undefined ? 1 : task.border
        }; // Set packing options
        var packer = new maxrects_packer_1.MaxRectsPacker(task.maxWidth, task.maxHeight, task.padding, options);
        var inputs = [];
        var saveName = task.name;
        images.forEach(function (info, key) {
            if (info) {
                info.imageContextInfos.forEach(function (item, key) {
                    var input = {
                        key: key,
                        x: 0,
                        y: 0,
                        width: item.width,
                        height: item.height,
                        url: item.url,
                        // rot: task.rotation,
                        spriteSourceSize: { x: 0, y: 0, w: item.width, h: item.height },
                        sourceSize: { w: item.width, h: item.height }
                    };
                    if (item.crop) {
                        input.spriteSourceSize.x = item.crop.x;
                        input.spriteSourceSize.y = item.crop.y;
                        input.spriteSourceSize.w = item.crop.w;
                        input.spriteSourceSize.h = item.crop.h;
                        input.width = item.crop.w;
                        input.height = item.crop.h;
                    }
                    inputs.push(input);
                });
            }
        });
        packer.addArray(inputs); // Start packing with input array
        packer.next(); // Start a new packer bin
        var idx = 0;
        var packerInfoList = [];
        if (task.subFolders) {
            if (packer.bins.length == 1 && anime) {
                var packerinfo_1 = maxrectspacker_to_texturepacker(packer.bins[0], srcPath, savePath + saveName + ".png", task.trim);
                packerinfo_1.animations = {};
                this.animations.forEach(function (element, key) {
                    var animation = [];
                    packerinfo_1.animations[key] = animation;
                    element.imageContextInfos.forEach(function (val, url) {
                        var name = url.replace(srcPath, "");
                        animation.push(name);
                    });
                    animation.sort();
                });
                packerInfoList.push(packerinfo_1);
            }
            else {
                console.error("Task " + task.name + " Can't Cobine To One Image !!!");
            }
        }
        else {
            if (packer.bins.length == 1 && anime) {
                var packerinfo_2 = maxrectspacker_to_texturepacker(packer.bins[0], srcPath, savePath + saveName + ".png", task.trim);
                packerinfo_2.animations = {};
                this.animations.forEach(function (element, key) {
                    var animation = [];
                    packerinfo_2.animations[key] = animation;
                    element.imageContextInfos.forEach(function (val, url) {
                        var name = url.replace(srcPath, "");
                        animation.push(name);
                    });
                    animation.sort();
                });
                packerInfoList.push(packerinfo_2);
            }
            else {
                packer.bins.forEach(function (bin) {
                    var packerinfo = maxrectspacker_to_texturepacker(bin, srcPath, savePath + saveName + "_" + idx + ".png", task.trim);
                    packerInfoList.push(packerinfo);
                    idx++;
                });
            }
        }
        return packerInfoList;
    };
    return TexturePacker;
}());
exports.TexturePacker = TexturePacker;
