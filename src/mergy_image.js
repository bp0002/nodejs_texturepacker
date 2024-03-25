"use strict";
exports.__esModule = true;
exports.mergyByTexturePacker = exports.mergyImages = void 0;
var images = require("images");
var image_1 = require("./pi_image/image");
function mergyImages(list, mergyWidth, mergyHeight, savePath) {
    return new Promise(function (resolve, rejects) {
        var image = images.createImage(mergyWidth, mergyHeight);
        var draws = [];
        list.forEach(function (item) {
            // let draw = 
        });
    });
}
exports.mergyImages = mergyImages;
function mergyByTexturePacker(imageMap, config, srcPath, savePath) {
    // console.log(`mergyByTexturePacker: ${config.image} - ${config.meta.size.w} - ${config.meta.size.h} - savePath: ${savePath}`);
    // return Promise.resolve(null);
    return new Promise(function (resolve, reject) {
        var width = config.meta.size.w;
        var height = config.meta.size.h;
        width = Math.ceil(width / 4) * 4;
        height = Math.ceil(height / 4) * 4;
        config.meta.size.w = width;
        config.meta.size.h = height;
        // let picture = images.createImage(width, height);
        console.log("mergyByTexturePacker: " + config.image + " - " + config.meta.size.w + " - " + config.meta.size.h + " - savePath: " + savePath);
        var data = Buffer.alloc(width * height * 4);
        for (var url in config.frames) {
            var image = imageMap.get(srcPath + url);
            var frame = config.frames[url];
            if (image) {
                var dx = frame.spriteSourceSize.x;
                var dy = frame.spriteSourceSize.y;
                var sw = frame.sourceSize.w;
                var sh = frame.sourceSize.h;
                var ox = frame.frame.x;
                var oy = frame.frame.y;
                var rw = frame.frame.w;
                var rh = frame.frame.h;
                console.error("Copy Image: " + image.url);
                if (image.url.endsWith(".jpg")) {
                    if (image.data.length == sw * sh * 3) {
                        if (frame.rotated) {
                            for (var i = 0; i < rh; i++) {
                                for (var j = 0; j < rw; j++) {
                                    var idx = (dy + i) * sw + (dx + j);
                                    var ridx = (oy + j) * width + (ox + (rw - i));
                                    data[ridx * 4 + 0] = image.data[idx * 3 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 3 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 3 + 2];
                                    data[ridx * 4 + 3] = 255;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < rh; i++) {
                                for (var j = 0; j < rw; j++) {
                                    var idx = (dy + i) * sw + (dx + j);
                                    var ridx = (oy + i) * width + (ox + j);
                                    data[ridx * 4 + 0] = image.data[idx * 3 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 3 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 3 + 2];
                                    data[ridx * 4 + 3] = 255;
                                }
                            }
                        }
                    }
                    else if (image.data.length == sw * sh * 4) {
                        if (frame.rotated) {
                            for (var i = 0; i < rh; i++) {
                                for (var j = 0; j < rw; j++) {
                                    var idx = (dy + i) * sw + (dx + j);
                                    var ridx = (oy + j) * width + (ox + (rw - i));
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < rh; i++) {
                                for (var j = 0; j < rw; j++) {
                                    var idx = (dy + i) * sw + (dx + j);
                                    var ridx = (oy + i) * width + (ox + j);
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        }
                    }
                    else {
                        console.error("Image Data Size Error: " + image.url + " data: " + image.data.length + " w: " + sw + " h: " + sh);
                    }
                    image.data = undefined;
                }
                else if (image.url.endsWith(".png")) {
                    if (image.data.length == sw * sh * 4) {
                        if (frame.rotated) {
                            for (var i = 0; i < rh; i++) {
                                for (var j = 0; j < rw; j++) {
                                    var idx = (dy + i) * sw + (dx + j);
                                    var ridx = (oy + j) * width + (ox + (rw - i));
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        }
                        else {
                            for (var row = 0; row < rh; row++) {
                                for (var col = 0; col < rw; col++) {
                                    var idx = (dy + row) * sw + (dx + col);
                                    var ridx = (oy + row) * width + (ox + col);
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        }
                    }
                    else {
                        console.error("Image Data Size Error: " + image.url + " data: " + image.data.length + " w: " + sw + " h: " + sh);
                    }
                    image.data = undefined;
                }
            }
            else {
                console.error("ImageInfo Fail: " + url);
            }
        }
        // picture.loadFromBuffer(Buffer.from(data));
        (0, image_1.saveUint8ArrayToPng)(data, width, height, savePath, function () { resolve(null); });
        // resolve(null);
        // picture.saveAsync(savePath + task.name, (err) => {
        //     if (err) {
        //         console.error(`Image Save Error: ${err}`);
        //         reject(err);
        //     } else {
        //         resolve(null);
        //     }
        // })
    });
}
exports.mergyByTexturePacker = mergyByTexturePacker;
