import { GLTF2Viewer, IGLTFRecorder, ImageInfo } from "./pi_gltf_interface/gltf2Viewer";
import { IGLTFOld } from "./pi_gltf_interface/interface";
import * as fs from "fs";
import { readJson } from "./read";
import { ImageCollect } from "./image_collect";
import * as images from "images";
import { formatUrl } from "./pi_path/path";
import { TexturePacker, maxrectspacker_to_texturepacker, texturepacker } from "./texture_packer";
import { Bin, MaxRectsPacker } from "maxrects-packer";
import { ICustomRect, ITexturePackAtlas } from "./interface/texturepacker";
import { ITexturePackTask } from "./interface/config";
import { trimImage } from "./trim_image";
import { mergyByTexturePacker } from "./mergy_image";
import { opt } from "./optimize";

function run(tasks: ITexturePackTask[], errors: string[]) {
    console.log(`ITexturePackTask 剩余: ${tasks.length}`);
    let task = tasks.pop();
    if (task == undefined) {
        return Promise.resolve(null);
    } else if (task.active == false) {
        return run(tasks, errors);
    } else {
        let texturepacker = new TexturePacker(task, configPath);
        return texturepacker.run(errors).then(([configs, imageInfoMap]) => {
            let savePath = formatUrl(configPath, task.target);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }
            let saveConfigs: ITexturePackAtlas[] = [];
            configs.forEach((item) => {
                saveConfigs.push(item);
            });

            return packCall(configs, imageInfoMap, texturepacker, task.alignSize, task.logMergy).then(() => {
                return new Promise((resolve, reject) => {
                    if (task.subFolders?.optCompact) {
                        let optResult = [];
                        saveConfigs.forEach((item) => {
                            optResult.push(opt(item, task.subFolders.optCompactFrameName));
                        });
                        fs.writeFile(`${savePath}${task.name}.atlas`, JSON.stringify(optResult), "utf-8", () => {
                            console.log(`Task ${task.name} End.`);
                            resolve(null)
                        });
                    } else {
                        fs.writeFile(`${savePath}${task.name}.atlas`, JSON.stringify(saveConfigs), "utf-8", () => {
                            console.log(`Task ${task.name} End.`);
                            resolve(null)
                        });
                    }
                }).then(() => {
                    return run(tasks, errors);
                });
            });
        });
    }
}

function packCall(configs: ITexturePackAtlas[], imageInfoMap: Map<string, ImageInfo>, texturepacker: TexturePacker, alignSize: number, logMergy: boolean) {
    let config = configs.pop();
    if (config) {
        return mergyByTexturePacker(imageInfoMap, config, texturepacker.srcPath, config.image, alignSize, logMergy).then(() => {
            config.image = config.image.replace(/(.*)src\//, "")
            console.log(`Image Pack End: ${config.image}`);
            return packCall(configs, imageInfoMap, texturepacker, alignSize, logMergy);
        }).catch((err) => {
            console.log(`Image Pack End: ${err}`);
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
    let errors = [];
    readJson(configPath).then((val: ITexturePackTask[]) => {
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