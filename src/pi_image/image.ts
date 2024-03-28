
import * as images from "images";
import * as fs from "fs";
import * as savePixels from "save-pixels";
import * as ndArray from "ndarray-scratch";
import { PNG } from "pngjs";
import * as jpeg from "jpeg-js";
import { base64ToImage } from "base64-to-image";
import * as Jimp from "jimp";

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

export function saveUint8ArrayToPng(data: Buffer, width: number, height: number, path: string, cb: (err) => void) {
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

    let jimp = new Jimp({ data: data, width, height }, (err) => {
        // cb(err);
        if (err) {
            cb(err);
        } else {
            jimp.resize(width, height);
            jimp.write(path, cb)
        }
        // this image is 1280 x 768, pixels are loaded from the given buffer.
    });
}

export function resizeImage(data: Uint8Array, srcWidth: number, srcHeight: number, dstWidth: number, dstHeight: number, cb: (err, data) => void) {

    let jimp = new Jimp({ data: data, width: srcWidth, height: srcHeight }, (err) => {
        // cb(err);
        if (err) {
            cb(err, null);
        } else {
            cb(null, new Uint8Array(jimp.resize(dstWidth, dstHeight).bitmap.data));
        }
    });
}

// passing screenshot as string over network
export function Uint8ArrayToBase64(arr: Uint8Array) {
    var base64 = arr.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return base64;
}

// passing screenshot as string over network
export function urlBase64ToUint8Array(base64String: string) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    var rawData = atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}