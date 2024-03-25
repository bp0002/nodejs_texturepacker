// import { loadImage } from "canvas";
import { IImageInfoRecorder, ImageInfo } from "./pi_gltf_interface/gltf2Viewer";
import * as fs from "fs";
import * as jpeg from "jpeg-js";
import * as png from "pngjs";
import { trimImage } from "./trim_image";

export class ImageCollect implements IImageInfoRecorder {
    /**
     * Map<全局图片路径, 图片内容信息>
     */
    public imageContextInfos: Map<string, ImageInfo> = new Map();
    constructor(
    ) {

    }
    query(key: string, url: string, trim?: boolean): Promise<ImageInfo> {
        let info = this.imageContextInfos.get(url);
        if (info) {
            return Promise.resolve(info);
        } else {
            if (trim) {
                return new Promise((resolve, reject) => {
                    if (url.endsWith(".png")) {
                        trimImage(url, (err, [data, crop, w, h]) => {
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
                                }
                            };
                            this.imageContextInfos.set(url, result);
                            resolve(result);
                        });
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
                                    }
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
                                let result: ImageInfo = {
                                    key,
                                    url,
                                    width: rawImageData.width,
                                    height: rawImageData.height,
                                    mode: 0,
                                    fileSize: jpegData.byteLength,
                                    modifyTime: 0,
                                };
                                this.imageContextInfos.set(url, result);
                                resolve(result);
                            } else {
                                console.error(err);
                                reject(err);
                            }
                        });
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
                                };
                                this.imageContextInfos.set(url, result);
                                resolve(result);
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