import * as fs from "fs";
import { readJson } from "./read";
import { formatUrl } from "./pi_path/path";
import { TexturePacker } from "./texture_packer";
import { ITexturePackAtlas } from "./interface/texturepacker";
import { ITexturePackTask } from "./interface/config";
import { mergyByTexturePacker } from "./mergy_image";

export function run(configPath) {
    readJson(configPath).then((val: ITexturePackTask[]) => {
        let texturepacker = new TexturePacker(val[0], configPath);
        texturepacker.run().then(([configs, imageInfoMap]) => {
            let savePath = formatUrl(configPath, val[0].target);
            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath);
            }
            let saveConfigs = [];
            let packCall = function (configs: ITexturePackAtlas[]) {
                let config = configs.pop();
                if (config) {
                    saveConfigs.push(config);
                    return mergyByTexturePacker(imageInfoMap, config, texturepacker.srcPath, config.image).then(() => {
                        config.image = config.image.replace(/(.*)src\//, "")
                        console.log(`Image Pack End: ${config.image}`);
                        return packCall(configs);
                    });
                } else {
                    return Promise.resolve(null)
                }
            }
    
            return packCall(configs).then(() => {
    
                fs.writeFile(`${savePath}texturepack.atlas`, JSON.stringify(saveConfigs), "utf-8", () => {
                    console.log("End");
                });
            });
        });
    });
}
