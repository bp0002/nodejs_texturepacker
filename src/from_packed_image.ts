import { readJson } from "./read";
import * as fs from "fs";
import * as jpeg from "jpeg-js";
import * as png from "pngjs";
import { ITexturePackAtlas, ITexturePackFrame } from "./interface/texturepacker";
import { formatUrl } from "./pi_path/path";
import { opt } from "./opt";


interface IFromPackedTask {
    /**
     * 源图片相对路径
     */
    imageSource: string;
    /**
     * 图片存储相对路径
     */
    target: string;
    /**
     * 保持的图集名称
     */
    name: string;
    /**
     * 动画名称
     */
    animName: string;
    /**
     * 行数目
     */
    column: number;
    /**
     * 列数目
     */
    row: number;
    /**
     * 图片是否已被Y轴翻转
     */
    isInvertY: boolean;
    /**
     * 任务是否激活
     */
    active: true;
    /**
     * 任务是否压缩数据
     */
    opt: boolean;
    /**
     * 采样模式
     */
    samplerMode?: number;
    /**
     * 半透明混合模式
     * 1 : One - One
     * 2 : SrcAlpha = OneMinusSrcAlpha
     * 7 : One - OneMinusSrcAlpha
     */
    alphaMode?: number;
    /**
     * 是否不使用 mipmap - 默认 true
     */
    noMipmap?: boolean;
    /**
     * 显示缩放比例
     */
    displayScale?: [number, number],
}

export function fromPacked(task: IFromPackedTask) {
    let url = task.imageSource;
    if (!task.active) {
        return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
        fs.readFile(url, (err, jpegData) => {
            let savePath = formatUrl(configPath, task.target);
            if (jpegData) {
                let width = 0;
                let height = 0;
                if (url.endsWith(".jpg")) {
                    let rawImageData = jpeg.decode(jpegData);
                    width = rawImageData.width;
                    height = rawImageData.height;
                } else {
                    let rawImageData = png.PNG.sync.read(jpegData);
                    width = rawImageData.width;
                    height = rawImageData.height;
                }
    
                let ceilWidth = Math.floor(width / task.column);
                let ceilHeight = Math.floor(height / task.row);
    
                let result: ITexturePackAtlas = {
                    frames: {},
                    image: (`${savePath}${task.name}.png`),
                    animations: {},
                    meta: {
                        "app": "pi_texturepacker",
                        "version": "",
                        "image": "Recordings.png",
                        "format": "",
                        "size": {
                            "w": width,
                            "h": height
                        },
                        "smartupdate": ""
                    },
                    samplerMode: task.samplerMode,
                    alphaMode: task.alphaMode,
                    noMipmap: task.noMipmap,
                    isInvertY: task.isInvertY,
                    scale: task.displayScale,
                };
    
                let idx = 0;
                if (task.isInvertY) {
                    for (let y = 0; y < task.row; y++) {
                        for (let x = 0; x < task.column; x++) {
                            let cx = x * ceilWidth;
                            let cy = (task.row - y - 1) * ceilHeight;
                            let frame: ITexturePackFrame = {
                                frame: { x: cx, y: cy, w: ceilWidth, h: ceilHeight },
                                rotated: false,
                                trimmed: false,
                                spriteSourceSize: { x: 0, y: 0, w: ceilWidth, h: ceilHeight },
                                sourceSize: { w: ceilWidth, h: ceilHeight }
                            }
                            result.frames[idx] = frame;
                            idx ++;
                        }
                    }
                } else {
                    for (let y = 0; y < task.row; y++) {
                        for (let x = 0; x < task.column; x++) {
                            let cx = x * ceilWidth;
                            let cy = y * ceilHeight;
                            let frame: ITexturePackFrame = {
                                frame: { x: cx, y: cy, w: ceilWidth, h: ceilHeight },
                                rotated: false,
                                trimmed: false,
                                spriteSourceSize: { x: 0, y: 0, w: ceilWidth, h: ceilHeight },
                                sourceSize: { w: ceilWidth, h: ceilHeight }
                            }
                            result.frames[idx] = frame;
                            idx ++;
                        }
                    }
                }
                let animation = [];
                for (let i = 0; i < idx; i++) {
                    animation.push(`${i}`);
                }
                result.animations[task.animName] = animation;

                result.image = result.image.replace(/(.*)src\//, "");

                if (task.opt) {
                    let optResult = opt(result, false);
                    fs.copyFileSync(`${task.imageSource}`, `${task.target}${task.name}.png`);
                    fs.writeFile(`${task.target}${task.name}.atlas`, JSON.stringify(optResult), "utf-8", (e) => {
                        resolve(null)
                    });
                } else {
                    fs.copyFileSync(`${task.imageSource}`, `${task.target}${task.name}.png`);
                    fs.writeFile(`${task.target}${task.name}.atlas`, JSON.stringify(result), "utf-8", (e) => {
                        resolve(null)
                    });
                }
            } else {
                reject(err)
            }
        });
    })
}

function run(tasks: IFromPackedTask[], errors: any[]) {
    let task = tasks.pop();
    if (task == undefined) {
        return Promise.resolve(null);
    } else {
        return fromPacked(task).then(() => {
            return run(tasks, errors);
        }).catch((err) => {
            errors.push(err);
        })
    }
}

let configPath = process.argv[2];
let idx: number;
if (process.argv[3] != undefined) {
    idx = (<any>process.argv[3]) - 0;
}
if (configPath) {
    let errors = [];
    readJson(configPath).then((val: IFromPackedTask[]) => {
        if (idx != undefined && !Number.isNaN(idx) && val.length > idx) {
            return run([val[idx]], errors);
        } else {
            return run(val, errors);
        }
    }).then(() => {
        console.log(`Tasks Finish!!`);
        errors.forEach((err) => {
            console.error(err);
        })
    });
}