"use strict";
exports.__esModule = true;
exports.urlBase64ToUint8Array = exports.Uint8ArrayToBase64 = exports.saveUint8ArrayToPng = void 0;
var Jimp = require("jimp");
/**
 * Decode base64 string to buffer.
 *
 * @param {String} base64Str string
 * @return {Object} Image object with image type and data buffer.
 * @public
 */
function decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image = {
        type: "",
        data: null
    };
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }
    image.type = matches[1];
    image.data = new Buffer(matches[2], 'base64');
    return image;
}
function saveUint8ArrayToPng(data, width, height, path, cb) {
    // var rawImageData = {
    //     data: data,
    //     width: width,
    //     height: height,
    // };
    // let jpegImageData = jpeg.encode(rawImageData);
    // fs.writeFile(path, jpegImageData.data, cb);
    // fs.writeFile(path, urlBase64ToUint8Array(data.toString('base64')), cb);
    // fs.writeFile(path, data, 'binary', cb);
    // var optionalObj = { 'fileName': path, 'type': 'png' };
    // base64ToImage(data.toString('base64'), path, optionalObj);
    var jimp = new Jimp({ data: data, width: width, height: height }, function (err, image) {
        // cb(err);
        if (err) {
            cb(err);
        }
        else {
            jimp.write(path, cb);
        }
        // this image is 1280 x 768, pixels are loaded from the given buffer.
    });
}
exports.saveUint8ArrayToPng = saveUint8ArrayToPng;
// passing screenshot as string over network
function Uint8ArrayToBase64(arr) {
    var base64 = arr.reduce(function (data, byte) { return data + String.fromCharCode(byte); }, '');
    return base64;
}
exports.Uint8ArrayToBase64 = Uint8ArrayToBase64;
// passing screenshot as string over network
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    var rawData = atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
exports.urlBase64ToUint8Array = urlBase64ToUint8Array;
