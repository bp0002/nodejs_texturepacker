"use strict";
exports.__esModule = true;
exports.ImageCollect = void 0;
var fs = require("fs");
var jpeg = require("jpeg-js");
var png = require("pngjs");
var trim_image_1 = require("./trim_image");
var ImageCollect = /** @class */ (function () {
    function ImageCollect() {
        /**
         * Map<全局图片路径, 图片内容信息>
         */
        this.imageContextInfos = new Map();
    }
    ImageCollect.prototype.query = function (key, url, trim, logTrim) {
        var _this = this;
        var info = this.imageContextInfos.get(url);
        if (info) {
            return Promise.resolve(info);
        }
        else {
            if (trim) {
                return new Promise(function (resolve, reject) {
                    if (url.endsWith(".png")) {
                        (0, trim_image_1.trimImage)(url, function (err, _a) {
                            var data = _a[0], crop = _a[1], w = _a[2], h = _a[3];
                            var result = {
                                key: key,
                                url: url,
                                width: w,
                                height: h,
                                mode: 0,
                                fileSize: w * h,
                                modifyTime: 0,
                                data: data,
                                crop: {
                                    x: crop.left,
                                    y: crop.top,
                                    w: crop.right - crop.left,
                                    h: crop.bottom - crop.top
                                }
                            };
                            _this.imageContextInfos.set(url, result);
                            resolve(result);
                        }, logTrim);
                    }
                    else if (url.endsWith(".jpg")) {
                        fs.readFile(url, function (err, jpegData) {
                            if (jpegData) {
                                var rawImageData = jpeg.decode(jpegData);
                                var result = {
                                    key: key,
                                    url: url,
                                    width: rawImageData.width,
                                    height: rawImageData.height,
                                    mode: 0,
                                    fileSize: jpegData.byteLength,
                                    modifyTime: 0,
                                    data: rawImageData.data,
                                    crop: {
                                        x: 0,
                                        y: 0,
                                        w: rawImageData.width,
                                        h: rawImageData.height
                                    }
                                };
                                _this.imageContextInfos.set(url, result);
                                resolve(result);
                            }
                            else {
                                console.error(err);
                                reject(err);
                            }
                        });
                    }
                });
            }
            else {
                return new Promise(function (resolve, reject) {
                    if (url.endsWith(".png")) {
                        fs.readFile(url, function (err, jpegData) {
                            if (jpegData) {
                                var rawImageData = png.PNG.sync.read(jpegData);
                                var result = {
                                    key: key,
                                    url: url,
                                    width: rawImageData.width,
                                    height: rawImageData.height,
                                    mode: 0,
                                    fileSize: jpegData.byteLength,
                                    modifyTime: 0
                                };
                                _this.imageContextInfos.set(url, result);
                                resolve(result);
                            }
                            else {
                                console.error(err);
                                reject(err);
                            }
                        });
                    }
                    else if (url.endsWith(".jpg")) {
                        fs.readFile(url, function (err, jpegData) {
                            if (jpegData) {
                                var rawImageData = jpeg.decode(jpegData);
                                var result = {
                                    key: key,
                                    url: url,
                                    width: rawImageData.width,
                                    height: rawImageData.height,
                                    mode: 0,
                                    fileSize: jpegData.byteLength,
                                    modifyTime: 0
                                };
                                _this.imageContextInfos.set(url, result);
                                resolve(result);
                            }
                            else {
                                console.error(err);
                                reject(err);
                            }
                        });
                    }
                    else {
                        reject("File err.");
                    }
                });
            }
            // return loadImage(url).then((img) => {
            //     return {
            //         width: img.width,
            //         height: img.height,
            //         url,
            //         mode: 0,
            //         modifyTime: 0,
            //     }
            // });
        }
    };
    return ImageCollect;
}());
exports.ImageCollect = ImageCollect;
