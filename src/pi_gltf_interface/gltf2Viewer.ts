import { IGLTFFile, IGLTFRefFileInfo } from "../interface/gltf_files";
import { formatUrl } from "../pi_path/path";
import { IAccessor, IBuffer, IBufferView, IImage, ISampler, ITexture, ITextureInfo } from "./glTF2Interface";
import { IGLTFNew, IGLTFOld, IMeshNew, IPITextureInfo, IPiTextureInfo } from "./interface";
import { readBin, readBinSync, sortNumberArray } from "../read";

export interface IVBuffer {
    data: Uint8Array,
    meta: IBuffer,
    gltfUrl: string,
    idx: number,
}

export interface IVGLTFBuffers {
    anim: Map<number, IVBuffer>,
    geo: Map<number, IVBuffer>,
}

export interface IVBufferView {
    index: number,
    data: Uint8Array,
    meta: IBufferView,
}

export interface IVAccessor {
    index: number,
    data: Uint8Array,
    meta: IAccessor,
}

export interface IVGeometry {
    position?: Float32Array,
    uv?: Float32Array,
    color?: Float32Array,
    normal?: Float32Array,
    indices?: Uint16Array,
    tangent?: Float32Array,
    uv2?: Float32Array,
    meta: IMeshNew,
}

export interface IVImage {
    meta: IImage,
    clampRefNum: number,
    refNum: number,
    usedTextureInfos: IPiTextureInfo[],
    usedTextureInfosClamp: IPiTextureInfo[],
}

export interface IVTexture {
    path: string;
    key: string;
    meta: ITexture;
    sampler: ISampler,
}


export interface IVMaterialTexture {
    meta: IPiTextureInfo,
}

export interface IVMesh {
    geometry: IVGeometry,

}

export interface IVGLTF {
    /**
     * GLTF 中的图片信息列表
     */
    images: IVImage[],
    /**
     * GLTF 路径
     */
    url: string,
}

export interface IGlobalImages {
    /**
     * 内容相同的图片信息列表
     */
    images: IVImage[],
    /**
     * 其中一个全局路径
     */
    globalUrl: string,
}

export interface IGLTF2Viewer {

}

function textureInfo(images: IVImage[], textures: ITexture[], samplers: ISampler[], tex: IPITextureInfo, withShaderSpeed: Set<string>, tilloffAbnormal: Set<string>) {
    if (tex) {
        let texInfo = textures[tex.index];
        let image = images[texInfo.source];

        if (tex.extras == undefined) { tex.extras = {} }
        if (tex.extras.scale === undefined) {
            tex.extras.scale = [1, 1];
        } else {
            if (tex.extras.scale[0] > 1 || tex.extras.scale[1] > 1 || tex.extras.scale[0] < 0 || tex.extras.scale[1] < 0) {
                tilloffAbnormal.add(image.meta.uri);
            }
        }
        if (tex.extras.offset === undefined) {
            tex.extras.offset = [0, 0];
        }

        if ((<IPiTextureInfo>tex).scale) {
            let temp = (<IPiTextureInfo>tex);
            if (temp.scale[0] > 1 || temp.scale[1] > 1 || temp.scale[0] < 0 || temp.scale[1] < 0) {
                tilloffAbnormal.add(image.meta.uri);
            }
        }

        if (withShaderSpeed) {
            withShaderSpeed.add(image.meta.uri);
        }

        image.refNum += 1;
        image.usedTextureInfos.push(tex);

        if (texInfo.sampler != undefined) {
            let sampler = samplers[texInfo.sampler];
            if (sampler.wrapS == undefined || sampler.wrapS == 33071) {
                image.clampRefNum += 1;
                image.usedTextureInfosClamp.push(tex);
            } else {
                // console.log(sampler.wrapS)
            }
        } else {
            image.clampRefNum += 1;
            image.usedTextureInfosClamp.push(tex);
        }
    }
}


export const IMAGE_EFFECT = 1;
export const IMAGE_MODEL = 0;

export interface ImageInfo {
    key: string,
    url: string,
    modifyTime: number,
    width: number,
    height: number,
    fileSize: number,
    mode: typeof IMAGE_EFFECT | typeof IMAGE_MODEL,
    data?: Uint8Array,
    crop?: { x: number, y: number, w: number, h: number },
    hash: string;
}

export interface IImageMergyRect {
    url: string,
    x: number,
    y: number,
    w: number,
    h: number,
}

export interface IImageMergyInfo {
    mergyUrl: string,
    width: number,
    height: number,
    mergyResult: IImageMergyRect[],
}

export interface IImageInfoRecorder {
    imageContextInfos: Map<string, ImageInfo>;
    query(key: string, url: string): Promise<ImageInfo>;
}

export interface IGLTFRecorder {
    forEach(func: (url: string, gltf: IGLTFOld) => void): void;
}

export class ImageInfoRecorder implements IImageInfoRecorder {
    public imageContextInfos: Map<string, ImageInfo> = new Map();
    public query(url: string): Promise<ImageInfo> {
        let result = this.imageContextInfos.get(url);
        if (result == undefined) {
            return new Promise((resolve, reject) => {
                this.loadImageInfo(url).then((data) => {
                    this.imageContextInfos.set(url, data);
                    resolve(data);
                })
                    .catch((err) => {
                        reject(err);
                    });
            });
        } else {
            return Promise.resolve(result);
        }
    }
    public loadImageInfo(url: string): Promise<ImageInfo> {
        return Promise.reject("Not Load!");
    }
}

export function analyGLTFRefFiles(url: string, gltf: IGLTFOld, map: Map<string, IGLTFRefFileInfo>) {
    let result: IGLTFRefFileInfo = {
        key: url.replace(/(.*\/)/, ""),
        path: url,
        bins: [],
        images: [],
    };

    gltf.buffers.forEach((item, idx) => {
        let file: IGLTFFile = {
            key: item.uri,
            path: formatUrl(url, item.uri),
            size: 0,
        };

        result.bins[idx] = file;
    });

    gltf.images.forEach((item, idx) => {
        let file: IGLTFFile = {
            key: item.uri,
            path: formatUrl(url, item.uri),
            size: 0,
        };

        result.images[idx] = file;
    });

    map.set(url, result);
}
/**
 * 
 * @param url gltf 路径
 * @param gltf gltf 数据
 * @param map 
 * @param globalImageMap 
 * @param withShaderSpeed 
 */
export function analyGLTFImages(url: string, gltf: IGLTFOld, map: Map<string, IVGLTF>, globalImageMap: Map<string, IGlobalImages>, withShaderSpeed: Set<string>, tilloffAbnormal: Set<string>) {
    let result = <IVGLTF>{
        images: [],
        url
    };
    let images: IVImage[] = result.images;
    gltf.images?.forEach((image, index) => {
        let vimage: IVImage = {
            meta: image,
            usedTextureInfos: [],
            usedTextureInfosClamp: [],
            refNum: 0,
            clampRefNum: 0,
        };
        images[index] = vimage;

        let globalImages = globalImageMap.get(<string>image.uri);
        if (globalImages == undefined) {
            globalImages = {
                images: [],
                globalUrl: formatUrl(url, <string>image.uri),
            };
            globalImageMap.set(<string>image.uri, globalImages);
        }
        globalImages.images.push(vimage);
    });

    let textures: ITexture[] = <ITexture[]>gltf.textures;
    let samplers: ISampler[] = <ISampler[]>gltf.samplers;

    gltf.materials?.forEach((mat, index) => {
        let matdata = mat.extensions?.PI_material;
        let force = false;
        {
            let tex = mat.extensions?.PI_material.maskTexture;
            if (matdata && (matdata.maskFlowMode != undefined)) {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, withShaderSpeed, tilloffAbnormal);
                force = true;
            } else {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, null, tilloffAbnormal);
            }
        }
        {
            let tex = mat.extensions?.PI_material.mask2Texture;
            if (force) {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, withShaderSpeed, tilloffAbnormal);
            } else {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, null, tilloffAbnormal);
            }
        }
        {
            let tex = mat.extensions?.PI_material.diffuseTexture;
            if (force || (matdata && (matdata.diffuseOU || matdata.diffuseOV))) {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, withShaderSpeed, tilloffAbnormal);
            } else {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, null, tilloffAbnormal);
            }
        }
        {
            let tex = mat.extensions?.PI_material.opacityTexture;
            if (force || (matdata && (matdata.opacityOU || matdata.opacityOV))) {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, withShaderSpeed, tilloffAbnormal);
            } else {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, null, tilloffAbnormal);
            }
        }
        {
            let tex = mat.extensions?.PI_material.emissionTexture;
            if (force || (matdata && (matdata.emissionOU || matdata.emissionOV))) {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, withShaderSpeed, tilloffAbnormal);
            } else {
                textureInfo(images, textures, samplers, <IPITextureInfo>tex, null, tilloffAbnormal);
            }
        }
    });

    map.set(url, result);
}

export function analyGLTFBuffer(url: string, gltf: IGLTFOld, gltfBuffers: Map<string, Map<number, IVBuffer>>, globalBuffersSizeKey: Map<number, IVBuffer[]>) {
    gltf.buffers?.forEach((item, idx) => {
        let map: Map<number, IVBuffer> = new Map();
        gltfBuffers.set(url, map);
        let info = {
            gltfUrl: url,
            data: undefined,
            meta: item,
            idx: idx,
        };
        map.set(idx, info);

        let size = item.byteLength;
        let list = globalBuffersSizeKey.get(size);
        if (list == undefined) {
            list = [];
            globalBuffersSizeKey.set(size, list);
        }
        list.push(info);
    });
}

export function loadGLTFBuffer(globalBuffersSizeKey: Map<number, IVBuffer[]>, singleBuffers: Map<string, string>, logSameBuffer: boolean) {
    globalBuffersSizeKey.forEach((list, key) => {
        if (list.length > 1) {
            let temp: { idx: number, same: Set<number>, data: Uint8Array }[] = [];
            list.forEach((item, idx) => {
                let path = formatUrl(item.gltfUrl, item.meta.uri);
                let data = readBinSync(path);
                if (data) {
                    item.data = data;
                    let info: { idx: number, same: Set<number>, data: Uint8Array } = { idx, data, same: new Set() };
                    info.same.add(idx);
                    temp.push(info);
                }
            });

            temp.sort((a, b) => {
                let result = sortNumberArray(a.data, b.data);
                if (result == 0) {
                    a.same.add(b.idx);
                    b.same.add(a.idx);
                    a.same.forEach((idx) => {
                        b.same.add(idx);
                    });
                    a.same = b.same;
                }
                return result;
            });

            {
                let single: Map<number, Set<number>> = new Map();
                temp.forEach((item) => {
                    let flag = false;
                    single.forEach((_, key) => {
                        flag = flag || item.same.has(key);
                    });
                    if (flag == false) {
                        single.set(item.idx, item.same);
                    }
                });

                if (logSameBuffer) {
                    console.log(`Single Buffer Count: ${single.size}`);
                }
                single.forEach((same, key) => {
                    let temp = [];
                    let first: IVBuffer;
                    same.forEach(idx => {
                        let item = list[idx];
                        temp.push(`${item.gltfUrl}#${idx}#${item.meta.uri}`);
                        if (first == undefined) {
                            first = item;
                            let path = formatUrl(item.gltfUrl, item.meta.uri);
                            singleBuffers.set(path, item.meta.uri);
                        } else {
                            item.meta.uri = first.meta.uri;
                        }
                    });
                    if (logSameBuffer) {
                        console.log(temp);
                    }
                });
            }
        } else {
            globalBuffersSizeKey.delete(key);
        }
    })
}

export class GLTF2Viewer {
    /**
     * Map<gltf路径, >
     */
    public gltfImagesMap: Map<string, IVGLTF> = new Map();
    /**
     * Map<gltf路径, >
     */
    public gltfFilesMap: Map<string, IGLTFRefFileInfo> = new Map();
    /**
     * Map<图片简名, 相同图片的信息列表>
     */
    public globalImages: Map<string, IGlobalImages> = new Map();
    /**
     * Map<图片简名, >
     */
    public globalImageInfoMap: Map<string, ImageInfo> = new Map();
    /**
     * Map<图片简名, 图片全路径>
     */
    public globalImageSingleMap: Map<string, string> = new Map();
    /**
     * Set<图片简名>
     */
    public globalImageWithShaderSpeed: Set<string> = new Set();
    /**
     * Set<图片简名>
     */
    public globalImageTilloffAbnormal: Set<string> = new Set();
}