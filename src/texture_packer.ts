import { exec, spawn } from "child_process";
import * as fs from "fs";
import { collectDirs, collectFiles, readJson } from "./read";
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

export function maxrectspacker_to_texturepacker(bin: Bin<ICustomRect>, urlClip: string, image: string, trimmed: boolean): ITexturePackAtlas {
    let result: ITexturePackAtlas = {
        frames: {},
        meta: {
            app: "pi_texturepacker",
            version: "",
            image: "",
            format: "",
            size: { w: bin.width, h: bin.height },
            smartupdate: "",
        },
        image,
    };

    bin.rects.forEach(element => {
        let key = element.key.replace(urlClip, "");
        result.frames[key] = {
            frame: { x: element.x, y: element.y, w: element.width, h: element.height },
            rotated: !!element.rot,
            trimmed: trimmed,
            spriteSourceSize: element.spriteSourceSize,
            sourceSize: element.sourceSize
        }
    });

    return <ITexturePackAtlas>result;
}

export class TexturePacker {
    private animations: Map<string, ImageCollect> = new Map();
    constructor(public readonly task: ITexturePackTask, private configPath: string) {
        let path = formatUrl(configPath, task.srcDir);
        console.log(`srcDir: ${path}`);
        console.log(`target: ${formatUrl(configPath, task.target)}`);
        console.log(`Name: ${task.name} }`);
    }

    public get srcPath() {
        return formatUrl(this.configPath, this.task.srcDir);
    }
    public run(): Promise<[ITexturePackAtlas[], Map<string, ImageInfo>]> {
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
                        this.collectFolderImageInfos(this.task, path).then((collect) => {
                            this.animations.set(key, collect);
                            collect.imageContextInfos.forEach((element, key) => {
                                map.set(key, element);
                            });
                        })
                    );
                });

                return Promise.all(promise).then(() => {
                    let atlas = this.pack(task, this.animations, srcPath, savePath, true);
                    return [atlas, map];
                });
            });
        } else {
            return this.collectFolderImageInfos(this.task, srcPath).then((imageCollect) => {
                this.animations.set(srcPath, imageCollect);
                imageCollect.imageContextInfos.forEach((element, key) => {
                    map.set(key, element);
                });
                let atlas = this.pack(task, this.animations, srcPath, savePath, false);
                return [atlas, map];
            });
        }
    }

    private collectFolderImageInfos(task: ITexturePackTask, path: string): Promise<ImageCollect> {
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
                        imageCollect.query(path, path, task.trim, task.logTrim)
                    );
                }
            });

            return Promise.all(promise).then(() => {
                console.log(`Collected: ${path} Collect Count: ${imageCollect.imageContextInfos.size}`);
                return imageCollect
            }).catch((err) => {
                console.error(`Collect Error: ${err}`);
            });
        });
    }

    private pack(task: ITexturePackTask, images: Map<string, ImageCollect>, srcPath: string, savePath: string, anime: boolean) {
        const options: IOption = {
            smart: true,
            pot: false,
            square: task.square,
            allowRotation: task.rotation,
            tag: task.useTag,
            border: task.border == undefined ? 1 : task.border,
        }; // Set packing options
        let packer = new MaxRectsPacker<ICustomRect>(task.maxWidth, task.maxHeight, task.padding, options);
        let inputs: ICustomRect[] = [];
        let saveName = task.name;

        images.forEach((info, key) => {
            if (info) {
                info.imageContextInfos.forEach((item, key) => {
                    let input: ICustomRect = {
                        key: key,
                        x: 0,
                        y: 0,
                        width: item.width,
                        height: item.height,
                        url: item.url,
                        // rot: task.rotation,
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
                })
            }
        });

        packer.addArray(inputs); // Start packing with input array
        packer.next(); // Start a new packer bin
        let idx = 0;
        let packerInfoList: ITexturePackAtlas[] = [];
        if (task.subFolders) {
            if (packer.bins.length == 1 && anime) {
                let packerinfo = maxrectspacker_to_texturepacker(packer.bins[0], srcPath, `${savePath + saveName}.png`, task.trim);
                packerinfo.animations = {};
                this.animations.forEach((element, key) => {
                    let animation = [];
                    packerinfo.animations[key] = animation;
                    element.imageContextInfos.forEach((val, url) => {
                        let name = url.replace(srcPath, "");
                        animation.push(name);
                    });
                    animation.sort();
                });
                packerInfoList.push(packerinfo);
            } else {
                console.error(`Image Pack Error: Task ${task.name} Can't Cobine To One Image !!!`);
            }
        } else {
            if (packer.bins.length == 1 && anime) {
                let packerinfo = maxrectspacker_to_texturepacker(packer.bins[0], srcPath, `${savePath + saveName}.png`, task.trim);
                packerinfo.animations = {};
                this.animations.forEach((element, key) => {
                    let animation = [];
                    packerinfo.animations[key] = animation;
                    element.imageContextInfos.forEach((val, url) => {
                        let name = url.replace(srcPath, "");
                        animation.push(name);
                    });
                    animation.sort();
                });
                packerInfoList.push(packerinfo);
            } else {
                packer.bins.forEach((bin: Bin<ICustomRect>) => {
                    let packerinfo = maxrectspacker_to_texturepacker(bin, srcPath, `${savePath + saveName}_${idx}.png`, task.trim);
                    packerInfoList.push(packerinfo);
                    idx++;
                });
            }
        }
        return packerInfoList;
    }
}