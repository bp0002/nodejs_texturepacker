import { exec, spawn } from "child_process";
import * as fs from "fs";
import { collectDirs, collectFiles } from "./read";
import { Bin, IOption, MaxRectsPacker, Rectangle } from "maxrects-packer";
import { ICustomRect, ITexturePackAtlas } from "./interface/texturepacker";
import { ITexturePackTask } from "./interface/config";
import { formatUrl } from "./pi_path/path";
import { IImageInfoRecorder, ImageInfo } from "./pi_gltf_interface/gltf2Viewer";
import { ImageCollect } from "./image_collect";

function commandline(exePath: string, spirtFolder: string, outputDir: string, outputName: string) {
    let result = `
SET "PATH=${exePath};%PATH%" & TexturePacker --format pixijs --multipack --disable-rotation --sheet ${outputDir}${outputName}_{n1}.png --data ${outputDir}${outputName}_{n1}.json ${spirtFolder}
`;
    return result;
}

export function texturepacker(exePath: string, spirtFolder: string, outputDir: string, outputName: string) {
    return new Promise((resolve, reject) => {
        let cmd = commandline(exePath, spirtFolder, outputDir, outputName);
        console.log(cmd);
        resolve(null);
        // let exe = spawn(cmd);
        // // , (error, stdout, stderr) => {
        // //     console.error(`${error}`);
        // //     console.error(stdout);
        // //     console.error(stderr);
        // //     console.warn(`TexturePacker End.`);
        // //     return readJson(`${outputDir}${outputName}.json`).then(resolve).catch(reject);
        // // });
        // exe.on("close", () => {
        //     console.warn(`TexturePacker End.`);
        //     return readJson(`${outputDir}${outputName}.json`).then(resolve).catch(reject);
        // });
        // exe.on("error", (err) => {
        //     console.warn(`TexturePacker Err. ${err}`);
        //     reject(err);
        // });
    })
}

export function maxrectspacker_to_texturepacker(bin: Bin<ICustomRect>, hashes: Map<string, string[]>, urlClip: string, image: string, trimmed: boolean, samplerMode?: number, alphaMode?: number, noMipmap?: boolean, isInvertY: boolean = false, scale?: [number, number]): ITexturePackAtlas {
    let result: ITexturePackAtlas = {
        frames: {},
        meta: {
            app: "pi_texturepacker",
            version: "",
            image: image.replace(/(.*\/)/, ""),
            format: "",
            size: { w: bin.width, h: bin.height },
            smartupdate: "",
        },
        image,
    };

    if (samplerMode) {
        result.samplerMode = samplerMode;
    }
    if (alphaMode) {
        result.alphaMode = alphaMode;
    }
    if (noMipmap != undefined) {
        result.noMipmap = noMipmap;
    }
    if (scale != undefined) {
        result.scale = scale;
    }
    result.isInvertY = isInvertY;

    bin.rects.sort((a, b) => { return a.key > b.key ? 1 : -1; });
    // console.warn(bin.rects);
    bin.rects.forEach(element => {
        let items = hashes.get(element.key);
        // if (items.length > 1) {
        //     console.log(...items);
        // }
        items.forEach((name) => {
            let key = name.replace(urlClip, "");
            result.frames[key] = {
                frame: { x: element.x, y: element.y, w: element.width, h: element.height },
                rotated: element.rot == true,
                trimmed: trimmed,
                spriteSourceSize: element.spriteSourceSize,
                sourceSize: element.sourceSize
            }
        })
    });

    return <ITexturePackAtlas>result;
}

export class TexturePacker {
    private animations: Map<string, ImageCollect> = new Map();
    constructor(public readonly task: ITexturePackTask, private configPath: string) {
        let path = formatUrl(configPath, task.srcDir);
        console.log(`srcDir: ${path}`);
        console.log(`target: ${formatUrl(configPath, task.target)}`);
        console.log(`Name: ${task.name}`);
    }

    public get srcPath() {
        return formatUrl(this.configPath, this.task.srcDir);
    }
    public run(errors: string[]): Promise<[ITexturePackAtlas[], Map<string, ImageInfo>]> {
        let task = this.task;
        let srcPath = formatUrl(this.configPath, task.srcDir);
        let savePath = formatUrl(this.configPath, task.target);
        let map: Map<string, ImageInfo> = new Map();

        if (task.subFolders) {
            let files: [string, string][] = [];
            let dirs: [string, string][] = [];
            return collectDirs([srcPath], dirs).then(() => {
                // console.log(dirs);
                // console.log(files);

                let promise = [];

                dirs.forEach((dir) => {
                    let key = dir[1];
                    let path = `${dir[0]}${dir[1]}/`;

                    promise.push(
                        this.collectFolderImageInfos(this.task, path, errors).then((collect) => {
                            this.animations.set(key, collect);
                            collect.imageContextInfos.forEach((element, key) => {
                                map.set(key, element);
                            });
                        })
                    );
                });

                return Promise.all(promise).then(() => {
                    let atlas = TexturePacker.pack(task, this.animations, srcPath, savePath, this.animations, true, errors);
                    return [atlas, map];
                });
            });
        } else {
            return this.collectFolderImageInfos(this.task, srcPath, errors).then((imageCollect) => {
                this.animations.set(srcPath, imageCollect);
                imageCollect.imageContextInfos.forEach((element, key) => {
                    map.set(key, element);
                });
                let atlas = TexturePacker.pack(task, this.animations, srcPath, savePath, this.animations, false, errors);
                return [atlas, map];
            });
        }
    }

    private collectFolderImageInfos(task: ITexturePackTask, path: string, errors: string[]): Promise<ImageCollect> {
        let files: [string, string][] = [];
        let dirs: [string, string][] = [];
        let imageCollect = new ImageCollect();
        return collectFiles([path], dirs, files).then(() => {
            // console.log(dirs);
            // console.log(files);

            let promise = [];
            files.forEach((file) => {
                let path = `${file[0]}${file[1]}`;
                if (task.logCollect) {
                    console.log(`Collecting: ${path}`);
                }
                if (path.endsWith(".png") || path.endsWith(".jpg")) {
                    promise.push(
                        imageCollect.query(path, path, task.trim, task.logTrim, 1, task.transparencyThreshold)
                    );
                }
            });

            return Promise.all(promise).then(() => {
                console.log(`Collected: ${path} Collect Count: ${imageCollect.imageContextInfos.size}`);
                return imageCollect
            }).catch((err) => {
                errors.push(err)
                // console.error(`Collect Error: ${err}`);
            });
        });
    }

    public static pack(task: ITexturePackTask, images: Map<string, ImageCollect>, urlClipPath: string, savePath: string, animations: Map<string, ImageCollect>, anime: boolean, errors: string[]) {
        const options: IOption = {
            smart: true,
            pot: task.pot,
            square: task.square,
            allowRotation: task.rotation,
            tag: task.useTag,
            border: task.border == undefined ? 0 : task.border,
        }; // Set packing options
        let packer = new MaxRectsPacker<ICustomRect>(task.maxWidth, task.maxHeight, task.padding, options);
        let inputs: ICustomRect[] = [];
        let saveName = task.name;
        // console.log(`task`, task);

        let hashes: Map<string, string[]> = new Map();

        images.forEach((info, key) => {
            if (info) {
                let keys = [];
                info.imageContextInfos.forEach((item, key) => {
                    keys.push(key);
                    let items = hashes.get(item.hash);
                    if (items == undefined) {
                        items = [];
                        hashes.set(item.hash, items);
                        let input: ICustomRect = {
                            key: item.hash,
                            x: 0,
                            y: 0,
                            width: item.width,
                            height: item.height,
                            url: item.url,
                            tag: key.replace(/\/[^\/]*$/, ""),
                            spriteSourceSize: { x: 0, y: 0, w: item.width, h: item.height },
                            sourceSize: { w: item.width, h: item.height },
                        };
                        if (item.crop) {
                            input.spriteSourceSize.x = item.crop.x;
                            input.spriteSourceSize.y = item.crop.y;
                            input.spriteSourceSize.w = item.crop.w;
                            input.spriteSourceSize.h = item.crop.h;
                            input.width = item.crop.w;
                            input.height = item.crop.h;
                        }
                        inputs.push(input);
                    }
                    items.push(key);
                });
                keys.sort();

                // console.log(`imageContextInfos keys`, keys);

                // hashes.forEach((items, key) => {
                //     let item = info.imageContextInfos.get(items[0]);
                //     console.log(items.length, key, items[0], item);
                //     let input: ICustomRect = {
                //         key: key,
                //         x: 0,
                //         y: 0,
                //         width: item.width,
                //         height: item.height,
                //         url: item.url,
                //         tag: items[0].replace(/\/[^\/]*$/, ""),
                //         spriteSourceSize: { x: 0, y: 0, w: item.width, h: item.height },
                //         sourceSize: { w: item.width, h: item.height },
                //     };
                //     if (item.crop) {
                //         input.spriteSourceSize.x = item.crop.x;
                //         input.spriteSourceSize.y = item.crop.y;
                //         input.spriteSourceSize.w = item.crop.w;
                //         input.spriteSourceSize.h = item.crop.h;
                //         input.width = item.crop.w;
                //         input.height = item.crop.h;
                //     }
                //     inputs.push(input);
                // })
            }
        });
        
        // hashes.forEach((items, key) => {
        //     console.log(items.length, key, ...items);
        // });

        packer.addArray(inputs); // Start packing with input array
        packer.next(); // Start a new packer bin
        let idx = 0;
        let packerInfoList: ITexturePackAtlas[] = [];
        if (task.subFolders) {
            if (packer.bins.length == 1 && anime) {
                let packerinfo = maxrectspacker_to_texturepacker(packer.bins[0], hashes, urlClipPath, `${savePath + saveName}.png`, task.trim, task.samplerMode, task.alphaMode, task.noMipmap, task.isInvertY, task.displayScale);
                packerinfo.animations = {};
                animations.forEach((element, key) => {
                    let animation = [];
                    packerinfo.animations[key] = animation;
                    element.imageContextInfos.forEach((val, url) => {
                        let name = url.replace(urlClipPath, "");
                        animation.push(name);
                    });
                    animation.sort();
                });
                packerInfoList.push(packerinfo);
            } else {
                let count = packer.bins.length;
                let moreCount = 0;
                for (let i = 1; i < count; i++) {
                    moreCount += packer.bins[i].rects.length;
                }
                let err = `\x1B[31m Image Pack Error: Task < ${task.name} > Can't Combine To One Image !!! - All Rect: < ${moreCount + packer.bins[0].rects.length} >, Not Combined Rect: < ${moreCount} > \x1B[0m`;
                console.error(err);
                errors.push(err);
            }
        } else {
            if (packer.bins.length == 1 && anime) {
                let packerinfo = maxrectspacker_to_texturepacker(packer.bins[0], hashes, urlClipPath, `${savePath + saveName}.png`, task.trim, task.samplerMode, task.alphaMode, task.noMipmap, task.isInvertY, task.displayScale);
                packerinfo.animations = {};
                animations.forEach((element, key) => {
                    let animation = [];
                    packerinfo.animations[key] = animation;
                    element.imageContextInfos.forEach((val, url) => {
                        let name = url.replace(urlClipPath, "");
                        animation.push(name);
                    });
                    animation.sort();
                });
                packerInfoList.push(packerinfo);
            } else {
                packer.bins.forEach((bin: Bin<ICustomRect>) => {
                    let packerinfo = maxrectspacker_to_texturepacker(bin, hashes, urlClipPath, `${savePath + saveName}_${idx}.png`, task.trim, task.samplerMode, task.alphaMode, task.noMipmap, task.isInvertY, task.displayScale);
                    packerInfoList.push(packerinfo);
                    idx++;
                });
            }
        }
        return packerInfoList;
    }
}