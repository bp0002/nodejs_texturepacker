"use strict";
exports.__esModule = true;
exports.GLTF2Viewer = exports.ImageInfoRecorder = exports.IMAGE_MODEL = exports.IMAGE_EFFECT = void 0;
var path_1 = require("../pi_path/path");
function textureInfo(images, textures, samplers, tex) {
    if (tex) {
        if (tex.extras == undefined) {
            tex.extras = {};
        }
        if (tex.extras.scale === undefined) {
            tex.extras.scale = [1, 1];
        }
        if (tex.extras.offset === undefined) {
            tex.extras.offset = [0, 0];
        }
        var texInfo = textures[tex.index];
        var image = images[texInfo.source];
        image.refNum += 1;
        image.usedTextureInfos.push(tex);
        if (texInfo.sampler != undefined) {
            var sampler = samplers[texInfo.sampler];
            if (sampler.wrapS == undefined || sampler.wrapS == 33071) {
                image.clampRefNum += 1;
                image.usedTextureInfosClamp.push(tex);
            }
            else {
                // console.log(sampler.wrapS)
            }
        }
        else {
            image.clampRefNum += 1;
            image.usedTextureInfosClamp.push(tex);
        }
    }
}
exports.IMAGE_EFFECT = 1;
exports.IMAGE_MODEL = 0;
var ImageInfoRecorder = /** @class */ (function () {
    function ImageInfoRecorder() {
        this.imageContextInfos = new Map();
    }
    ImageInfoRecorder.prototype.query = function (url) {
        var _this = this;
        var result = this.imageContextInfos.get(url);
        if (result == undefined) {
            return new Promise(function (resolve, reject) {
                _this.loadImageInfo(url).then(function (data) {
                    _this.imageContextInfos.set(url, data);
                    resolve(data);
                })["catch"](function (err) {
                    reject(err);
                });
            });
        }
        else {
            return Promise.resolve(result);
        }
    };
    ImageInfoRecorder.prototype.loadImageInfo = function (url) {
        return Promise.reject("Not Load!");
    };
    return ImageInfoRecorder;
}());
exports.ImageInfoRecorder = ImageInfoRecorder;
var GLTF2Viewer = /** @class */ (function () {
    function GLTF2Viewer() {
        this.gltfImagesMap = new Map();
        /**
         * Map<图片简名, 相同图片的信息列表>
         */
        this.globalImages = new Map();
    }
    GLTF2Viewer.prototype.gltfImages = function (recorder) {
        var _this = this;
        recorder.forEach(function (url, gltf) {
            var _a, _b;
            var gltfImages = {
                images: [],
                url: url,
                gltf: gltf
            };
            var images = gltfImages.images;
            (_a = gltf.images) === null || _a === void 0 ? void 0 : _a.forEach(function (image, index) {
                var vimage = {
                    meta: image,
                    usedTextureInfos: [],
                    usedTextureInfosClamp: [],
                    refNum: 0,
                    clampRefNum: 0
                };
                images[index] = vimage;
                var globalImages = _this.globalImages.get(image.uri);
                if (globalImages == undefined) {
                    globalImages = {
                        images: [],
                        globalUrl: (0, path_1.formatUrl)(url, image.uri)
                    };
                    _this.globalImages.set(image.uri, globalImages);
                }
                globalImages.images.push(vimage);
            });
            var textures = gltf.textures;
            var samplers = gltf.samplers;
            (_b = gltf.materials) === null || _b === void 0 ? void 0 : _b.forEach(function (mat, index) {
                var _a, _b, _c, _d;
                {
                    var tex = (_a = mat.extensions) === null || _a === void 0 ? void 0 : _a.PI_material.diffuseTexture;
                    textureInfo(images, textures, samplers, tex);
                }
                {
                    var tex = (_b = mat.extensions) === null || _b === void 0 ? void 0 : _b.PI_material.opacityTexture;
                    textureInfo(images, textures, samplers, tex);
                }
                {
                    var tex = (_c = mat.extensions) === null || _c === void 0 ? void 0 : _c.PI_material.emissionTexture;
                    textureInfo(images, textures, samplers, tex);
                }
                {
                    var tex = (_d = mat.extensions) === null || _d === void 0 ? void 0 : _d.PI_material.maskTexture;
                    textureInfo(images, textures, samplers, tex);
                }
            });
            _this.gltfImagesMap.set(url, gltfImages);
        });
    };
    GLTF2Viewer.prototype.analyImages = function (recorder) {
        var imageUrlList = [];
        this.globalImages.forEach(function (info, url) {
            var clampRefNum = 0;
            var refNum = 0;
            info.images.forEach(function (item) {
                clampRefNum += item.clampRefNum;
                refNum += item.refNum;
            });
            // if (clampRefNum > 0) {
            //     imageUrlList.push(recorder.query(info.globalUrl));
            // }
            imageUrlList.push(recorder.query(url, info.globalUrl).then(function (data) {
                return data;
            }));
        });
        return Promise.all(imageUrlList);
    };
    return GLTF2Viewer;
}());
exports.GLTF2Viewer = GLTF2Viewer;
