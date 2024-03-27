import { ISpriteAtlas, ISpriteAtlasCells, ISpriteAtlasRects, ITexturePackAtlas } from "./interface/sprite";

export class GlobalAtlasManager {
    public static atlasMap: Map<string, Atlas> = new Map();
    private static atlasLoadMap: Map<string, Promise<null>> = new Map();
    private static readonly Default: [number, number, number, number] = [1, 1, 0, 0]
    public static load(atlasConfigPath: string) {

    }
    public static regist(atlas: ISpriteAtlas | ISpriteAtlas[]) {
        if (atlas instanceof Array) {
            atlas.forEach((item) => {
                GlobalAtlasManager.atlasMap.set(item.image, new Atlas(item));
            });
        } else {
            GlobalAtlasManager.atlasMap.set(atlas.image, new Atlas(atlas));
        }
    }
    public static getAtlas(atlas: ISpriteAtlas | string): Atlas {
        if ((<ISpriteAtlas>atlas).image) {
            let result = GlobalAtlasManager.atlasMap.get(<string>(<ISpriteAtlas>atlas).image);
            if (result == undefined) {
                GlobalAtlasManager.regist(<ISpriteAtlas>atlas);
            }

            return GlobalAtlasManager.atlasMap.get(<string>(<ISpriteAtlas>atlas).image);
        } else {
            return GlobalAtlasManager.atlasMap.get(<string>atlas);
        }
    }
    /**
     * 
     * @param spriteFrame 
     * @param atlasKey 如果知道散图属于哪个图集可以加快运行速度
     * @returns 
     */
    public static getFrame(spriteFrame: string | number, atlasKey?: string): [number, number, number, number] {
        if (atlasKey) {
            let atlas = this.atlasMap.get(atlasKey);
            return atlas.getFrame(spriteFrame) || GlobalAtlasManager.Default;
        } else {
            let keys = this.atlasMap.keys();
            let key = keys.next().value;
            let result = undefined;
            while (key) {
                let atlas = this.atlasMap.get(key);

                if (atlas) {
                    result = atlas.getFrame(spriteFrame);
                    if (result) {
                        break;
                    }
                }
                key = keys.next().value;
            }

            return result || GlobalAtlasManager.Default;
        }
    }
    /**
     * 
     * @param spriteFrame 
     * @param atlasKey 如果知道散图属于哪个图集可以加快运行速度
     * @returns 
     */
    public static getAtlasByFrame(spriteFrame: string | number, atlasKey?: string): Atlas {
        if (atlasKey) {
            let atlas = this.atlasMap.get(atlasKey);
            return atlas;
        } else {
            let keys = this.atlasMap.keys();
            let key = keys.next().value;
            let result: Atlas = undefined;
            while (key) {
                let atlas = this.atlasMap.get(key);

                if (atlas) {
                    atlas.getFrame(spriteFrame);
                    if (atlas.getFrame(spriteFrame)) {
                        result = atlas;
                        break;
                    }
                }
                key = keys.next().value;
            }

            return result;
        }
    }
    public static extendAtlasFrame(atlasKey: string, key: string | number, rect: [number, number, number, number]): void {
        let atlas = this.atlasMap.get(atlasKey);
        if (atlas) {
            atlas.extendAtlasFrame(key, rect);
        }
    }
}

export class Atlas {
    protected _atlasFrames: { [index: string | number]: [number, number, number, number] };
    public readonly atlasImage: string;
    constructor(public readonly atlas: ISpriteAtlas) {
        if ((<ITexturePackAtlas>atlas).meta) {
            this.atlasImage = (<ITexturePackAtlas>atlas).image;
        } else {
            this.atlasImage = (<ISpriteAtlasRects>atlas).image;
        }

        if ((<ISpriteAtlasRects>this.atlas).rects) {
            this._atlasFrames = (<ISpriteAtlasRects>this.atlas).rects;
        } else if ((<ITexturePackAtlas>atlas).meta) {
            let atlasFrames: { [index: string]: [number, number, number, number] } = {};

            let w = (<ITexturePackAtlas>atlas).meta.size.w;
            let h = (<ITexturePackAtlas>atlas).meta.size.h;
            for (let key in (<ITexturePackAtlas>atlas).frames) {
                let frame = (<ITexturePackAtlas>atlas).frames[key];
                if (frame.rotated) {
                    let uoff = frame.frame.x / w;
                    let voff = frame.frame.y / h;
                    let hsize = frame.frame.h / w;
                    let vsize = frame.frame.w / h;
                    atlasFrames[key] = [hsize, vsize, uoff, voff];
                } else {
                    let uoff = frame.frame.x / w;
                    let voff = frame.frame.y / h;
                    let hsize = frame.frame.w / w;
                    let vsize = frame.frame.h / h;
                    atlasFrames[key] = [hsize, vsize, uoff, voff];
                }
            }
            this._atlasFrames = <{ [index: string]: [number, number, number, number] }>atlasFrames;
        } else {
            let atlasFrames: [number, number, number, number][] = [];

            let hCount = (<ISpriteAtlasCells>this.atlas).hCount;
            let vCount = (<ISpriteAtlasCells>this.atlas).vCount;
            let hsize = (<ISpriteAtlasCells>this.atlas).hsize;
            let vsize = (<ISpriteAtlasCells>this.atlas).vsize;
            let frames = hCount * vCount;
            for (let i = 0; i < frames; i++) {
                let uoff = i % hCount * hsize;
                let voff = Math.floor(i / hCount) * vsize;
                atlasFrames[i] = [hsize, vsize, uoff, voff];
            }

            this._atlasFrames = <{ [index: number]: [number, number, number, number] }>atlasFrames;
        }
    }
    extendAtlasFrame(key: string | number, rect: [number, number, number, number]): void {
        this._atlasFrames[key] = rect;
    }
    getFrame(spriteFrame: string | number): [number, number, number, number] {
        return this._atlasFrames[spriteFrame];
    }
}