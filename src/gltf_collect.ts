import { GLTF2Viewer, IGLTFRecorder, ImageInfo, analyGLTFImages, analyGLTFRefFiles } from "./pi_gltf_interface/gltf2Viewer";
import { IGLTFOld } from "./pi_gltf_interface/interface";
import * as fs from "fs";
import { readJson } from "./read";
import { ImageCollect } from "./image_collect";
import * as images from "images";
import { formatUrl, makeDir } from "./pi_path/path";
import { TexturePacker, maxrectspacker_to_texturepacker, texturepacker } from "./texture_packer";
import { Bin, MaxRectsPacker } from "maxrects-packer";
import { ICustomRect, ITexturePackAtlas } from "./interface/texturepacker";
import { ITexturePackTask } from "./interface/config";
import { trimImage } from "./trim_image";
import { mergyByTexturePacker } from "./mergy_image";
import { IGLTFTaskConfig } from "./interface/gltf_task";
import { GlobalAtlasManager } from "./sprite_atlas";

export class GLTFCollect implements IGLTFRecorder {
    public gltfs: Map<string, IGLTFOld> = new Map();
    constructor(
        public readonly rooturl: string
    ) {

    }
    collect(): Promise<void> {
        return GLTFCollect._collectFiles([this.rooturl], this.gltfs).then(() => {
            let promises = [];
            this.gltfs.forEach((val, key) => {
                let promise = readJson(key).then((data) => {
                    this.gltfs.set(key, data);
                });
                promises.push(promise);
            });

            return Promise.all(promises);
        });
    }
    forEach(func: (url: string, gltf: IGLTFOld) => void): void {
        this.gltfs.forEach((val, key) => {
            if (val) {
                func(key, val)
            }
        });
    }
    public static _collectFiles(list: string[], gltfs: Map<string, IGLTFOld>) {
        let tempList = [];
        let promises = [];
        list.forEach((path) => {
            let promise = new Promise((resolve, reject) => {
                fs.readdir(path, (err, files) => {
                    if (files) {
                        let len = files.length;
                        for (let i = 0; i < len; i++) {
                            let file = files[i];
                            if (file.endsWith(".gltf")) {
                                gltfs.set(`${path}${file}`, null);
                            } else {
                                file = path + file + "/";
                                // console.log(file);
                                tempList.push(file);
                                // if (file.endsWith("/")) {
                                //     tempList.push(file);
                                // }
                            }
                        }
                    }
                    resolve(null);
                });
            });
            promises.push(promise);
        });

        if (promises.length == 0) {
            return Promise.resolve(null);
        } else {
            return Promise.all(promises).then(() => { return GLTFCollect._collectFiles(tempList, gltfs) });
        }
    }
}

export function run(tasks: IGLTFTaskConfig[]) {
    console.log(`ITexturePackTask 剩余: ${tasks.length}`);

    let task = tasks.pop();
    if (task == undefined) {
        return Promise.resolve(null);
    } else if (task.active == false) {
        return run(tasks);
    } else {
        let srcPath = formatUrl(configPath, task.srcDir);
        let savePath = formatUrl(configPath, task.target);
        let collect = new GLTFCollect(srcPath);
        let gltfviewer = new GLTF2Viewer();
        let imgCollect = new ImageCollect();
        collect.collect().then(() => {
            collect.forEach((url, gltf) => {
                analyGLTFRefFiles(url, gltf, gltfviewer.gltfFilesMap);
                analyGLTFImages(url, gltf, gltfviewer.gltfImagesMap, gltfviewer.globalImages, gltfviewer.globalImageWithShaderSpeed);
            });

            let infos = [];
            gltfviewer.gltfImagesMap.forEach((item) => {
                let temp = [];
                infos.push(temp);
                item.images.forEach((it) => {
                    temp.push(it.meta.uri);
                });
            });
            fs.writeFile(`${savePath}${task.name}.json`, JSON.stringify(infos), "utf-8", () => {
                console.log(`Task ${task.name} End.`);
                // resolve(null)
            });

            let imageUrlList: Promise<null>[] = [];
            gltfviewer.globalImages.forEach((info, key) => {
                let clampRefNum = 0;
                let refNum = 0;
                info.images.forEach((item) => {
                    clampRefNum += item.clampRefNum;
                    refNum += item.refNum;
                });
                imageUrlList.push(
                    imgCollect.query(key, info.globalUrl, false, false).then((data) => {
                        return null;
                    })
                );
            });

            return Promise.all(imageUrlList).then(() => {
                makeDir(savePath);
                {
                    let tasktexture = {
                        name: task.name,
                        pot: task.pot,
                        alignSize: task.alignSize,
                        trim: false,
                        rotation: false,
                        srcDir: task.srcDir,
                        target: task.target,
                        maxHeight: task.maxHeight,
                        maxWidth: task.maxWidth,
                        active: true,
                        square: true,
                        useTag: true,
                        border: task.border,
                        padding: task.padding,
                        logCollect: task.logCollect,
                        logTrim: false,
                        logMergy: task.logMergy
                    };
                    let map: Map<string, ImageCollect> = new Map();
                    map.set(task.name, imgCollect);

                    let bigMap: Map<string, ImageInfo> = new Map();

                    imgCollect.imageContextInfos.forEach((item, key) => {
                        if (item.width >= 512 && item.height >= 512) {
                            imgCollect.imageContextInfos.delete(key);
                            bigMap.set(key, item);
                        }
                    });

                    gltfviewer.globalImageWithShaderSpeed.forEach((key) => {
                        let info = gltfviewer.globalImages.get(key);
                        let item = imgCollect.imageContextInfos.get(info.globalUrl);
                        if (item) {
                            imgCollect.imageContextInfos.delete(info.globalUrl);
                            bigMap.set(info.globalUrl, item);
                        } else if (bigMap.has(info.globalUrl)) {
                            // console.log(`Again`);
                        } else {
                            console.log(`Image Not Found ContextInfo ${info.globalUrl}`);
                        }
                    });

                    let atlas = TexturePacker.pack(tasktexture, map, "", savePath, map, false);

                    GlobalAtlasManager.regist(atlas);
                    let saveatlas = [];
                    atlas.forEach((atlas) => {
                        saveatlas.push(atlas);
                    });

                    return packCall(atlas, imgCollect.imageContextInfos, "", task.pot ? 1 : task.alignSize, task.logMergy).then(() => {
                        fs.writeFile(`${savePath}${task.name}.atlas`, JSON.stringify(saveatlas), "utf-8", () => {
                            console.log(`Task ${task.name} End.`);
                            // resolve(null)
                        });
                        gltfviewer.globalImages.forEach((info, key) => {
                            let atlas = GlobalAtlasManager.getAtlasByFrame(info.globalUrl);
                            // if (info.globalUrl.endsWith("SeVJkop3q6o9Mim8CqN5Ts.png")) {
                            //     console.warn("SeVJkop3q6o9Mim8CqN5Ts", atlas);
                            // }
                            if (atlas) {
                                let uri = atlas.atlasImage.replace(/(.*\/)/, "");
                                let frame = atlas.getFrame(info.globalUrl);
                                if (frame) {
                                    info.images.forEach((item) => {
                                        // if (key == "FZPUQwQCCABMjX3Yoj1pux.png") {
                                        //     console.error(`Image Key: ${key}, meta.uri: ${item.meta.uri}`);
                                        // }
                                        // console.error(`Image Key: ${key}, meta.uri: ${item.meta.uri}`);
                                        item.meta.uri = uri;
                                        item.usedTextureInfos.forEach((it) => {
                                            if (it.scale == undefined) { it.scale = [1, 1] }
                                            if (it.offset == undefined) { it.offset = [0, 0] }
                                            it.scale[0] = it.scale[0] * frame[0];
                                            it.scale[1] = it.scale[1] * frame[1];
                                            it.offset[0] = it.offset[0] * frame[0] + frame[2];
                                            it.offset[1] = it.offset[1] * frame[1] + frame[3];

                                            if (it.extras) {
                                                it = it.extras;
                                                if (it.scale == undefined) { it.scale = [1, 1] }
                                                if (it.offset == undefined) { it.offset = [0, 0] }
                                                it.scale[0] = it.scale[0] * frame[0];
                                                it.scale[1] = it.scale[1] * frame[1];
                                                it.offset[0] = it.offset[0] * frame[0] + frame[2];
                                                it.offset[1] = it.offset[1] * frame[1] + frame[3];
                                            }
                                        });
                                    });
                                }
                            }
                        });

                        bigMap.forEach((item, url) => {
                            // if (url.endsWith("SeVJkop3q6o9Mim8CqN5Ts.png")) {
                            //     if (fs.existsSync(`${savePath}${item.key}`) == false) {
                            //         fs.copyFileSync(url, `${savePath}${item.key}`);
                            //         console.warn(`CopyFile: ${savePath}${item.key}`);
                            //     } else {

                            //         console.warn(`CopyFile Fail: ${savePath}${item.key}`);
                            //     }
                            // } else {
                            if (fs.existsSync(`${savePath}${item.key}`) == false) {
                                fs.copyFileSync(url, `${savePath}${item.key}`);
                            }
                            // }
                        });
                        collect.forEach((url, gltf) => {
                            fs.writeFileSync(`${savePath}${url.replace(/(.*\/)/, "")}`, JSON.stringify(gltf), "utf-8");
                        });
                        gltfviewer.gltfFilesMap.forEach((item) => {
                            item.bins.forEach((bin) => {
                                fs.copyFileSync(bin.path, `${savePath}${bin.key}`);
                            });
                        });
                    }).then(() => {
                        return run(tasks);
                    });
                }

            });
        });
    }
}

function packCall(configs: ITexturePackAtlas[], imageInfoMap: Map<string, ImageInfo>, srcPath: string, alignSize: number, logMergy: boolean) {
    let config = configs.pop();
    if (config) {
        return mergyByTexturePacker(imageInfoMap, config, srcPath, config.image, alignSize, logMergy).then(() => {
            config.image = config.image.replace(/(.*)src\//, "")
            console.log(`Image Pack End: ${config.image}`);
            return packCall(configs, imageInfoMap, srcPath, alignSize, logMergy);
        });
    } else {
        return Promise.resolve(null)
    }
}

let configPath = process.argv[2];
let idx: number;
if (process.argv[3] != undefined) {
    idx = (<any>process.argv[3]) - 0;
}
if (configPath) {
    readJson(configPath).then((val: IGLTFTaskConfig[]) => {
        if (idx != undefined && !Number.isNaN(idx) && val.length > idx) {
            return run([val[idx]]);
        } else {
            return run(val);
        }
    }).then(() => {
        console.log(`Tasks Finish!!`);
    });
}
