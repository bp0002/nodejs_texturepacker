import * as images from "images";
import * as png from "pngjs";
import { ICustomRect, ITexturePackAtlas } from "./interface/texturepacker";
import { ImageCollect } from "./image_collect";
import { ImageInfo } from "./pi_gltf_interface/gltf2Viewer";
import { ITexturePackTask } from "./interface/config";
import { saveUint8ArrayToPng } from "./pi_image/image";

export function mergyImages(list: ICustomRect[], mergyWidth: number, mergyHeight: number, savePath: string): Promise<void> {
    return new Promise((resolve, rejects) => {
        let image = images.createImage(mergyWidth, mergyHeight);
        let draws = [];
        list.forEach((item) => {
            // let draw = 
        });
    });
}

export function mergyByTexturePacker(imageMap: Map<string, ImageInfo>, config: ITexturePackAtlas, srcPath: string, savePath: string) {
    // console.log(`mergyByTexturePacker: ${config.image} - ${config.meta.size.w} - ${config.meta.size.h} - savePath: ${savePath}`);
    // return Promise.resolve(null);
    return new Promise((resolve, reject) => {
        let width = config.meta.size.w;
        let height = config.meta.size.h;
        width = Math.ceil(width / 4) * 4;
        height = Math.ceil(height / 4) * 4;
        config.meta.size.w = width;
        config.meta.size.h = height;

        // let picture = images.createImage(width, height);
        console.log(`mergyByTexturePacker: ${config.image} - ${config.meta.size.w} - ${config.meta.size.h} - savePath: ${savePath}`);

        let data = Buffer.alloc(width * height * 4);

        for (let url in config.frames) {
            let image = imageMap.get(srcPath + url);
            let frame = config.frames[url];
            if (image) {
                let dx = frame.spriteSourceSize.x;
                let dy = frame.spriteSourceSize.y;
                let sw = frame.sourceSize.w;
                let sh = frame.sourceSize.h;
                let ox = frame.frame.x;
                let oy = frame.frame.y;
                let rw = frame.frame.w;
                let rh = frame.frame.h;
                console.error(`Copy Image: ${image.url}`);
                if (image.url.endsWith(".jpg")) {
                    if (image.data.length == sw * sh * 3) {
                        if (frame.rotated) {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + j) * width + (ox + (rw - i));
                                    data[ridx * 4 + 0] = image.data[idx * 3 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 3 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 3 + 2];
                                    data[ridx * 4 + 3] = 255;
                                }
                            }
                        } else {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + i) * width + (ox + j);
                                    data[ridx * 4 + 0] = image.data[idx * 3 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 3 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 3 + 2];
                                    data[ridx * 4 + 3] = 255;
                                }
                            }
                        }
                    } else if (image.data.length == sw * sh * 4) {
                        if (frame.rotated) {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + j) * width + (ox + (rw - i));
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        } else {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + i) * width + (ox + j);
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        }
                    } else {
                        console.error(`Image Data Size Error: ${image.url} data: ${image.data.length} w: ${sw} h: ${sh}`);
                    }
                    image.data = undefined;
                } else if (image.url.endsWith(".png")) {
                    if (image.data.length == sw * sh * 4) {
                        if (frame.rotated) {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + j) * width + (ox + (rw - i));
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        } else {
                            for (let row = 0; row < rh; row++) {
                                for (let col = 0; col < rw; col++) {
                                    let idx = (dy + row) * sw + (dx + col);
                                    let ridx = (oy + row) * width + (ox + col);
                                    data[ridx * 4 + 0] = image.data[idx * 4 + 0];
                                    data[ridx * 4 + 1] = image.data[idx * 4 + 1];
                                    data[ridx * 4 + 2] = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        }
                    } else {
                        console.error(`Image Data Size Error: ${image.url} data: ${image.data.length} w: ${sw} h: ${sh}`);
                    }
                    image.data = undefined;
                }
            } else {
                console.error(`ImageInfo Fail: ${url}`);
            }
        }

        // picture.loadFromBuffer(Buffer.from(data));
        saveUint8ArrayToPng(data, width, height, savePath, () => { resolve(null) });
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