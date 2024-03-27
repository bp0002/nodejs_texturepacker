import { ITexturePackAtlas, ITexturePackFrame } from "./texturepacker";
export { ITexturePackFrame, ITexturePackAtlas } from "./texturepacker";


export interface ISpriteAtlasCells {
    image: string;
    hCount: number;
    vCount: number;
    hsize: number;
    vsize: number;
}
export interface ISpriteAtlasRects {
    image: string;
    rects: {
        [index: string | number]: [number, number, number, number]
    }
}
export type ISpriteAtlas = ISpriteAtlasCells | ISpriteAtlasRects | ITexturePackAtlas;
export type ISpriteInfo = [string, number];
