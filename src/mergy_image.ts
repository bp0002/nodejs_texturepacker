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

export function mergyByTexturePacker(imageMap: Map<string, ImageInfo>, config: ITexturePackAtlas, srcPath: string, savePath: string, alignSize: number, log: boolean = false) {
    // console.log(`mergyByTexturePacker: ${config.image} - ${config.meta.size.w} - ${config.meta.size.h} - savePath: ${savePath}`);
    // return Promise.resolve(null);
    return new Promise((resolve, reject) => {
        let width = config.meta.size.w;
        let height = config.meta.size.h;
        width = Math.ceil(width / alignSize) * alignSize;
        height = Math.ceil(height / alignSize) * alignSize;
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
                if (log) {
                    console.error(`Mergy Image: ${image.url}`);
                }
                if (image.url.endsWith(".jpg")) {
                    if (image.data.length == sw * sh * 3) {
                        if (frame.rotated) {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + j) * width + (ox + (rh - i - 1));
                                    let r = image.data[idx * 3 + 0];
                                    let g = image.data[idx * 3 + 1];
                                    let b = image.data[idx * 3 + 2];
                                    data[ridx * 4 + 0] = r;
                                    data[ridx * 4 + 1] = g;
                                    data[ridx * 4 + 2] = b;
                                    data[ridx * 4 + 3] = 255; //(r + b + g < 1) ? 0 : 255;
                                }
                            }
                        } else {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + i) * width + (ox + j);
                                    let r = image.data[idx * 3 + 0];
                                    let g = image.data[idx * 3 + 1];
                                    let b = image.data[idx * 3 + 2];
                                    data[ridx * 4 + 0] = r;
                                    data[ridx * 4 + 1] = g;
                                    data[ridx * 4 + 2] = b;
                                    data[ridx * 4 + 3] = 255;//(r + b + g < 1) ? 0 : 255;
                                }
                            }
                        }
                    } else if (image.data.length == sw * sh * 4) {
                        if (frame.rotated) {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + j) * width + (ox + (rh - i - 1));
                                    let r = image.data[idx * 4 + 0];
                                    let g = image.data[idx * 4 + 1];
                                    let b = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 0] = r;
                                    data[ridx * 4 + 1] = g;
                                    data[ridx * 4 + 2] = b;
                                    // data[ridx * 4 + 3] = (r + b + g < 1) ? 0 : image.data[idx * 4 + 3];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        } else {
                            for (let i = 0; i < rh; i++) {
                                for (let j = 0; j < rw; j++) {
                                    let idx = (dy + i) * sw + (dx + j);
                                    let ridx = (oy + i) * width + (ox + j);
                                    let r = image.data[idx * 4 + 0];
                                    let g = image.data[idx * 4 + 1];
                                    let b = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 0] = r;
                                    data[ridx * 4 + 1] = g;
                                    data[ridx * 4 + 2] = b;
                                    // data[ridx * 4 + 3] = (r + b + g < 1) ? 0 : image.data[idx * 4 + 3];
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
                            for (let row = 0; row < rh; row++) {
                                for (let col = 0; col < rw; col++) {
                                    let idx = (dy + row) * sw + (dx + col);
                                    let ridx = (oy + col) * width + (ox + (rh - row - 1));
                                    let r = image.data[idx * 4 + 0];
                                    let g = image.data[idx * 4 + 1];
                                    let b = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 0] = r;
                                    data[ridx * 4 + 1] = g;
                                    data[ridx * 4 + 2] = b;
                                    // data[ridx * 4 + 3] = (r + b + g < 1) ? 0 : image.data[idx * 4 + 3];
                                    data[ridx * 4 + 3] = image.data[idx * 4 + 3];
                                }
                            }
                        } else {
                            for (let row = 0; row < rh; row++) {
                                for (let col = 0; col < rw; col++) {
                                    let idx = (dy + row) * sw + (dx + col);
                                    let ridx = (oy + row) * width + (ox + col);
                                    let r = image.data[idx * 4 + 0];
                                    let g = image.data[idx * 4 + 1];
                                    let b = image.data[idx * 4 + 2];
                                    data[ridx * 4 + 0] = r;
                                    data[ridx * 4 + 1] = g;
                                    data[ridx * 4 + 2] = b;
                                    // data[ridx * 4 + 3] = (r + b + g < 1) ? 0 : image.data[idx * 4 + 3];
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