import { ITexturePackAtlas, ITexturePackAtlasCompact, ITexturePackFrameCompact } from "./interface/texturepacker";
import { readJson } from "./read";
import * as fs from "fs";

export function optAtlas(fileName: string, saveName: string, compactFrameName: boolean) {
    console.warn("optAtlas >> " + fileName);
    return readJson(fileName).then((data: ITexturePackAtlas | ITexturePackAtlas[]) => {
        let result: ITexturePackAtlasCompact | ITexturePackAtlasCompact[];
        if (data instanceof Array) {
            result = [];
            data.forEach((item) => {
                (<ITexturePackAtlasCompact[]>result).push(opt(item, compactFrameName));
            });
        } else {
            result = opt(data, compactFrameName);
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(saveName, JSON.stringify(result), "utf-8", (e) => {
                resolve(null)
            });
        });
    });
}

export function opt(data: ITexturePackAtlas, compactFrameName: boolean = true) : ITexturePackAtlasCompact {
    let frameIdx = 0;
    let frameNames: Map<string, string> = new Map();
    if ((<any>data).compact) {
        return <ITexturePackAtlasCompact> (data as any);
    } else {
        for (let key in data.frames) {
            if (compactFrameName) {
                frameNames.set(key, `${frameIdx++}`);
            } else {
                frameNames.set(key, key);
            }
        }
        let result: ITexturePackAtlasCompact = {
            frames: {},
            meta: data.meta,
            image: data.image,
            compact: true,
        };

        if (data.samplerMode) {
            result.samplerMode = data.samplerMode;
        }
        if (data.alphaMode) {
            result.alphaMode = data.alphaMode;
        }
        if (data.noMipmap != undefined) {
            result.noMipmap = data.noMipmap;
        }
        if (data.scale != undefined) {
            result.scale = data.scale;
        }
        result.isInvertY = data.isInvertY;
    
        for (let key in data.frames) {
            let temp = data.frames[key];
            let compact: ITexturePackFrameCompact = [
                temp.rotated ? 1 : 0,
                temp.trimmed ? 1 : 0,
                temp.sourceSize.w, temp.sourceSize.h,
                temp.spriteSourceSize.x, temp.spriteSourceSize.y, temp.spriteSourceSize.w, temp.spriteSourceSize.h,
                temp.frame.x, temp.frame.y, temp.frame.w, temp.frame.h,
            ];
    
            result.frames[frameNames.get(key)] = compact;
        }
    
        if (data.animations) {
            result.animations = {};
            for (let key in data.animations) {
                let temp = data.animations[key];
                let compact = [];
                temp.forEach((frame) => {
                    compact.push(frameNames.get(frame));
                });
                result.animations[key] = compact;
            }
        }
    
        return result;
    }
}
