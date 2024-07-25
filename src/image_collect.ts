// import { loadImage } from "canvas";
import { IImageInfoRecorder, ImageInfo } from "./pi_gltf_interface/gltf2Viewer";
import * as fs from "fs";
import * as jpeg from "jpeg-js";
import * as png from "pngjs";
import { trimImage } from "./trim_image";
import { resizeImage } from "./pi_image/image";
import { sha256 } from "js-sha256";

export class ImageCollect implements IImageInfoRecorder {
    /**
     * Map<全局图片路径, 图片内容信息>
     */
    public imageContextInfos: Map<string, ImageInfo> = new Map();
    constructor(
    ) {

    }
    query(key: string, url: string, trim?: boolean, logTrim?: boolean, maxScaleFator: number = 1, alphaTrim: number = 0, transparencyFromGray: boolean = false): Promise<ImageInfo> {
        let info = this.imageContextInfos.get(url);
        if (info) {
            return Promise.resolve(info);
        } else {
            if (trim) {
                return new Promise((resolve, reject) => {
                    if (url.endsWith(".png")) {
                        trimImage(url, (err, [data, crop, w, h]) => {
                            crop.left = Math.max(0, crop.left - 1);
                            crop.right = Math.min(w, crop.right + 1);
                            crop.top = Math.max(0, crop.top - 1);
                            crop.bottom = Math.min(h, crop.bottom + 1);
                            let result: ImageInfo = {
                                key,
                                url,
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
                                    h: crop.bottom - crop.top,
                                },
                                hash: sha256(data)
                            };
                            this.imageContextInfos.set(url, result);
                            resolve(result);
                        }, logTrim, alphaTrim, transparencyFromGray);
                    } else if (url.endsWith(".jpg")) {
                        fs.readFile(url, (err, jpegData) => {
                            if (jpegData) {
                                var rawImageData = jpeg.decode(jpegData);
                                let result: ImageInfo = {
                                    key,
                                    url,
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
                                        h: rawImageData.height,
                                    },
                                    hash: sha256(rawImageData.data)
                                };
                                this.imageContextInfos.set(url, result);
                                resolve(result);
                            } else {
                                console.error(err);
                                reject(err);
                            }
                        });
                    }
                });
            } else {
                return new Promise((resolve, reject) => {
                    if (url.endsWith(".png")) {
                        fs.readFile(url, (err, jpegData) => {
                            if (jpegData) {
                                var rawImageData = png.PNG.sync.read(jpegData);
                                let factor = (rawImageData.data.length) / jpegData.byteLength;
                                let scale = Math.pow(2, Math.round(Math.log2(Math.sqrt(factor))))
                                scale = Math.min(maxScaleFator, scale);
                                // console.log(`Resize: ${url} - ${scale} - ${factor}`);
                                let srcWidth = rawImageData.width;
                                let srcHeight = rawImageData.height;
                                if (scale == 1 || (srcWidth >= 512 || srcHeight >= 512)) {
                                    let result: ImageInfo = {
                                        key,
                                        url,
                                        width: rawImageData.width,
                                        height: rawImageData.height,
                                        mode: 0,
                                        fileSize: jpegData.byteLength,
                                        modifyTime: 0,
                                        data: rawImageData.data,
                                        hash: sha256(rawImageData.data)
                                    };
                                    this.imageContextInfos.set(url, result);
                                    resolve(result);
                                } else {
                                    let dstWidth = Math.round(srcWidth / scale);
                                    let dstHeight = Math.round(srcHeight / scale);
                                    console.log(`Resize: ${url} - ${srcWidth} - ${srcHeight} - ${dstWidth} - ${dstHeight} - ${factor}`)
                                    resizeImage(rawImageData.data, srcWidth, srcHeight, dstWidth, dstHeight, (err, data) => {
                                        if (err) {
                                            console.error(err);
                                            reject(err);
                                        } else {
                                            let result: ImageInfo = {
                                                key,
                                                url,
                                                width: dstWidth,
                                                height: dstHeight,
                                                mode: 0,
                                                fileSize: jpegData.byteLength,
                                                modifyTime: 0,
                                                data: data,
                                                hash: sha256(rawImageData.data)
                                            };
                                            this.imageContextInfos.set(url, result);
                                            resolve(result);
                                        }
                                    });
                                }
                            } else {
                                console.error(err);
                                reject(err);
                            }
                        });
                    } else if (url.endsWith(".jpg")) {
                        fs.readFile(url, (err, jpegData) => {
                            if (jpegData) {
                                var rawImageData = jpeg.decode(jpegData);
                                let factor = (rawImageData.data.length) / jpegData.byteLength;
                                let scale = Math.pow(2, Math.round(Math.log2(Math.sqrt(factor))))
                                scale = Math.min(maxScaleFator, scale);
                                // console.log(`Resize: ${url} - ${scale} - ${factor}`);

                                let srcWidth = rawImageData.width;
                                let srcHeight = rawImageData.height;
                                if (scale == 1 || (srcWidth >= 512 || srcHeight >= 512)) {
                                    let result: ImageInfo = {
                                        key,
                                        url,
                                        width: rawImageData.width,
                                        height: rawImageData.height,
                                        mode: 0,
                                        fileSize: jpegData.byteLength,
                                        modifyTime: 0,
                                        data: rawImageData.data,
                                        hash: sha256(rawImageData.data)
                                    };
                                    this.imageContextInfos.set(url, result);
                                    resolve(result);
                                } else {
                                    let dstWidth = Math.round(srcWidth / scale);
                                    let dstHeight = Math.round(srcHeight / scale);
                                    console.log(`Resize: ${url} - ${srcWidth} - ${srcHeight} - ${dstWidth} - ${dstHeight} - ${factor}`)
                                    resizeImage(rawImageData.data, srcWidth, srcHeight, dstWidth, dstHeight, (err, data) => {
                                        if (err) {
                                            console.error(err);
                                            reject(err);
                                        } else {
                                            let result: ImageInfo = {
                                                key,
                                                url,
                                                width: dstWidth,
                                                height: dstHeight,
                                                mode: 0,
                                                fileSize: jpegData.byteLength,
                                                modifyTime: 0,
                                                data: data,
                                                hash: sha256(data)
                                            };
                                            this.imageContextInfos.set(url, result);
                                            resolve(result);
                                        }
                                    });
                                }
                            } else {
                                console.error(err);
                                reject(err);
                            }
                        });
                    } else {
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
    }
}