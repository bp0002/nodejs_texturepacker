import { IRectangle } from "maxrects-packer";

export interface ICustomRect extends IRectangle {
    key: string,
    url: string,
    rot?: boolean,
    /**
     * all input with same will be packed in the same bin.
     */
    tag?: string,
    spriteSourceSize: { x: number, y: number, w: number, h: number },
    sourceSize: { w: number, h: number }
}

export interface ITexturePackFrame {
    frame: { x: number, y: number, w: number, h: number },
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: { x: number, y: number, w: number, h: number },
    sourceSize: { w: number, h: number }
}

export interface ITexturePackAtlas {
    frames: {
        [index: string]: ITexturePackFrame,
    },
    animations?: {
        [index: string]: string[],
    },
    meta: {
        app: "https://www.codeandweb.com/texturepacker" | string,
        version: string,
        image: string,
        format: string,
        size: { w: number, h: number },
        smartupdate: string,
    },
    samplerMode?: number;
    alphaMode?: number;
    noMipmap?: boolean;
    isInvertY?: boolean;
    scale?: [number, number],
    image: string;
}

export type ITexturePackFrameCompact = [number, number, number, number, number, number, number, number, number, number, number, number, ];

export interface ITexturePackAtlasCompact {
    frames: {
        [index: string]: ITexturePackFrameCompact,
    },
    animations?: {
        [index: string]: string[],
    },
    meta: {
        app: "https://www.codeandweb.com/texturepacker" | string,
        version: string,
        image: string,
        format: string,
        size: { w: number, h: number },
        smartupdate: string,
    },
    image: string;
    samplerMode?: number;
    alphaMode?: number;
    noMipmap?: boolean;
    compact?: boolean;
    isInvertY?: boolean;
    scale?: [number, number],
}