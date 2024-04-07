import * as GLTF2 from "./glTF2Interface";
import { IParticleSystemConfig } from "./mesh_particle_system/iparticle_system_config";

/**
 * Loader interface with additional members.
 */
export interface IGLTFOld extends GLTF2.IGLTF {
    /** @internal */
    accessors?: GLTF2.IAccessor[],

    /** @internal */
    animations?: OldIAnimation[],

    /** @internal */
    buffers?: GLTF2.IBuffer[],

    /** @internal */
    bufferViews?: GLTF2.IBufferView[],

    /** @internal */
    cameras?: GLTF2.ICamera[],

    /** @internal */
    images?: GLTF2.IImage[],

    /** @internal */
    materials?: IMaterialOld[],

    /** @internal */
    meshes?: IMeshOld[],

    /** @internal */
    nodes?: INodeOld[],

    /** @internal */
    samplers?: GLTF2.ISampler[],

    /** @internal */
    scenes?: GLTF2.IScene[],

    /** @internal */
    skins?: GLTF2.ISkin[],

    /** @internal */
    textures?: GLTF2.ITexture[],
}

export interface IPiTextureInfo extends GLTF2.ITextureInfo {
    scale?: [number, number],
    offset?: [number, number],
}
/**
 * Loader interface with additional members.
 */
export interface IGLTFNew extends GLTF2.IGLTF {
    [x: string]: any,
    /** @internal */
    accessors?: GLTF2.IAccessor[],

    /** @internal */
    animations?: INewIAnimation[],

    asset: IAssetNew,

    extensions?: {
        KHR_lights_punctual?: IKHRLightsPunctualNew,
    }

    extras: {
        animations?: GLTF2.IAnimation[],
        imageSolts?: any[],
        materialSolts?: any[],
    }

    /** @internal */
    buffers?: GLTF2.IBuffer[],

    /** @internal */
    bufferViews?: GLTF2.IBufferView[],

    /** @internal */
    cameras?: ICameraNew[],

    /** @internal */
    images?: GLTF2.IImage[],

    /** @internal */
    materials?: IMaterialNew[],

    /** @internal */
    meshes?: IMeshNew[],

    /** @internal */
    nodes?: INodeNew[],

    /** @internal */
    samplers?: GLTF2.ISampler[],

    /** @internal */
    scenes?: GLTF2.IScene[],

    /** @internal */
    skins?: GLTF2.ISkin[],

    /** @internal */
    textures?: GLTF2.ITexture[],
}

export interface ICameraNew extends GLTF2.ICamera {
    orthographic?: ICameraOrthographicNew,
    // perspective?: ICameraPerspective,

    extras?: {
        cullingMask?: number,
    },
    cullingMask?: number,
}

export interface ICameraOrthographicNew extends GLTF2.ICameraOrthographic {
    size?: number,
}

export interface IKHRLightsPunctual_LightNew extends GLTF2.IKHRLightsPunctual_Light {
    //#region PI
    extras?: {
        isLocal?: boolean,
        shadowOnly?: boolean,
        cullingMask?: number,
    }
    isLocal?: boolean,
    shadowOnly?: boolean,
    cullingMask?: number,
    //#endregion
}

/** @internal */
export interface IKHRLightsPunctualNew {
    lights: IKHRLightsPunctual_LightNew[],
}

export interface IAssetOld extends GLTF2.IAsset {
    extras: {
        exporterVersion: string,
        VersionNumber: "20200904",
    }
}

export interface IAssetNew extends GLTF2.IAsset {
    extras: {
        exporterVersion: string,
        VersionNumber: "20230626",
    }
}

export interface IMaterialOld extends GLTF2.IMaterial {
    extensions: {
        PI_material: IMaterialDataOld,
    }
}

export interface IMaterialData extends GLTF2.IChildRootProperty {
    type: string,
    alphaMode?: number,
    zWrite?: 1,
    alpha?: number,
    alphaCutOff?: number,
    cull?: string,
    renderQueue?: number,
}

export interface IMaterialDataOld extends IMaterialData {
    /**
     * 材质类型
     */
    type: string,

    /**
     * 共用材质的ID
     */
    instanceID?: string,

    alphaMode: number,
    needAlphaBlend?: 1,
    zWrite?: 1,

    disableLighting: boolean,
    diffuseColor?: [number, number, number],
    specularColor?: [number, number, number],
    specularPower?: number,
    ambientColor?: [number, number, number],
    reflectivityColor: [number, number, number],

    alpha: number,
    cull: string,

    useAlphaFromDiffuseTexture: boolean,
    diffuseTexture?: IPITextureInfo,

    opacityTexture?: IPITextureInfo,

    emissionColor: [number, number, number],
    emissionTexture?: IPITextureInfo,

    bumpTexture?: IPITextureInfo,
    normalScale?: number,

    // useLightmapAsShadowmap?: boolean,
    lightmapTexture?: IPITextureInfo,

    // Fresnel
    EFBias?: number,
    EFPower?: number,
    EFLeft?: [number, number, number],
    EFRight?: [number, number, number],
    emissiveMapLevel?: number,
    // Opacity Fresnel
    OFBias?: number,
    OFPower?: number,
    OFLeft?: [number, number, number],
    OFRight?: [number, number, number],

    // alphaCutOff
    alphaCutOff?: number,
    /**
     * cutoffEdgeThickness
     */
    coET?: number,
    /**
     * cutoffEdgeColor
     */
    coEColor?: [number, number, number],
    /**
     * cutoffEdgeLevel
     */
    coEL?: number,
    /**
     * cutoffEdgeAlphaDiff
     */
    coEAD?: number,

    fog?: boolean,

    alphaClip?: boolean,
    renderQueue?: number,
    diffuseOU?: number,
    diffuseOV?: number,
    emissionOU?: number,
    emissionOV?: number,
    opacityOU?: number,
    opacityOV?: number,
    diffuseLevel?: number,
    opacityLevel?: number,

    ambientTexture?: IPITextureInfo,
    ambientMapLevel?: number,

    maskColor?: [number, number, number],
    maskTexture?: IPITextureInfo,
    mask2Texture?: IPITextureInfo,
    maskLevel?: number,

    diffusePreAlpha?: number,
    opacityApplyRGB?: number,

    // Mix Two Opacity
    MixOUS?: number,
    MixOVS?: number,
    MixOUO?: number,
    MixOVO?: number,
    MixOUSp?: number,
    MixOVSp?: number,
    MixOIns?: number,
    MixCUS?: number,
    MixCVS?: number,
    MixCUO?: number,
    MixCVO?: number,
    MixCIns?: number,
    MixCVal?: number,

    // distortion UV
    distortionX?: number,
    distortionY?: number,
    distortionSX?: number,
    distortionSY?: number,
    maskFlowMode?: 0 | 1,
}

export interface IMaterialDataNew {
    PI_material: IMaterialData,
    main_opacity?: IMainOpacityMaterial,
    main_opacity_emissive_fresnel?: IMainOpacityMaterial,
    distortionUV?: IDistortionUVMaterial,
    two_opacity_mix?: ITwoOpacityMixMaterial,
    main_opacity_opacity_fresnel?: IMainOpacityOpacityFresnelMaterial,
}

export interface IMaterialNew extends GLTF2.IChildRootProperty {
    extras: IMaterialDataNew,
}
export enum EAnimationPropertyID {
    Position = 0,
    RotationQuaternion = 1,
    "Scaling",
    "MainTexUScale",
    "MainTexVScale",
    "MainTexUOffset",
    "MainTexVOffset",
    "Alpha",
    "MainColor",
    "ort",
    "per",
    "IsActive",
    "Euler",
    "intensity",
    "lightdiffuse",
    "AlphaCutOff",
    "cellId",
    "OpacityTexUScale",
    "OpacityTexVScale",
    "OpacityTexUOffset",
    "OpacityTexVOffset",
    "MaskCutoff",
    "MaskTexUScale",
    "MaskTexVScale",
    "MaskTexUOffset",
    "MaskTexVOffset",
}
/// [动画属性ID, target, Input(byteOffset, count, bufferByteOffset, bufferLength), Output(byteOffset, count, bufferByteOffset, bufferLength), interpolation]
export const OldAnimationPropertyIDIndex = 0;
export const OldAnimationTargetIDIndex = 1;
export const OldAnimationInputOffsetIndex = 2;
export const OldAnimationInputCountIndex = 3;
export const OldAnimationInputBufferOffsetIndex = 4;
export const OldAnimationInputBufferLengthIndex = 5;
export const OldAnimationOutputOffsetIndex = 6;
export const OldAnimationOutputCountIndex = 7;
export const OldAnimationOutputBufferOffsetIndex = 8;
export const OldAnimationOutputBufferlengthIndex = 9;
export const OldAnimationInterpolationIndex = 10;
export type IAnimationData = [number, number, number, number, number, number, number, number, number, number, number];
export interface OldIAnimation extends GLTF2.IAnimation {
    PiChannel?: IAnimationData[],
    nodeIndex?: number,
    buffer?: number,
}
// ["STEP", "LINEAR", "PICUBICSPLINE", "CUBICSPLINE"];
export enum InterpolationType {
    "STEP" = 0,
    "LINEAR",
    "PICUBICSPLINE",
    "CUBICSPLINE"
}
export enum GLTFInterpolationType {
    "LINEAR" = 1,
    "STEP" = 2,
    "CUBICSPLINE" = 3,
    "PICUBICSPLINE" = 4,
}
export type TAnimationTargetPropertyID = number;
export type TAnimationTargetNodeIndex = number;
export type TAnimationSamplerIndex = number;
export type TAnimationInputByteoffset = number;
export type TAnimationInputCount = number;
export type TAnimationInputBufferByteoffset = number;
export type TAnimationInputBufferLength = number;
export type TAnimationOutputByteoffset = number;
export type TAnimationOutputCount = number;
export type TAnimationOutputBufferByteoffset = number;
export type TAnimationOutputBufferLength = number;
export type TAnimationSamplerInput = [TAnimationInputCount, TAnimationInputCount, TAnimationInputBufferByteoffset, TAnimationInputBufferLength]; // number;
export type TAnimationSamplerOutput = [TAnimationOutputByteoffset, TAnimationOutputCount, TAnimationOutputBufferByteoffset, TAnimationOutputBufferLength]; // number;
export type TAnimationSamplerInterpolation = number;
export interface INewAnimationChannel extends GLTF2.IAnimationChannel {
    extras?: {
        property?: EAnimationPropertyID,
    }
}
export interface INewAnimationSampler extends GLTF2.IAnimationSampler {
    extras?: {
        interpolation?: GLTFInterpolationType,
    }
}

export interface INewIAnimation extends GLTF2.IAnimation {
    channels: INewAnimationChannel[],
    name: string,
    samplers: INewAnimationSampler[],
    extras?: {
        events: [number, string][],
        SkinAnim: [number, number, number, number, number, number, number, number, string, string],
    }
}

export interface IMeshOld extends GLTF2.IMesh {
    geometry?: string,
    alphaIndex?: number,
    layerMask?: number,
    receiveShadows?: number,
    castShadow?: number,
    primitives: IMeshPrimitiveOld[],
}

export interface IBakedFrameData {
    start: number,
    count: number,
}

export interface IBakedKeyframe {
    frames: number,
    data: IBakedFrameData[],
}

export type IBakedKeyframeNew = number[];
export interface IBakedKeyframes {
    duration: number,
    keyframes: IBakedKeyframe[],
}
export interface IBakedKeyframesNew {
    duration: number,
    keyframes: IBakedKeyframeNew,
}

export interface IMeshPrimitiveOld extends GLTF2.IMeshPrimitive {
    extras?: {
        bakeframes?: IBakedKeyframes,
    }
}

export interface IMeshPrimitiveNew extends GLTF2.IMeshPrimitive {
    extras?: {
        subMeshes?: number[][],
        bakeframes?: IBakedKeyframes,
        bakeframesNew?: IBakedKeyframesNew,
    }
}

export interface IMeshNew extends GLTF2.IMesh {
    extras: {
        isSkybox?: boolean,
        geometry?: string,
        alphaIndex?: number,
        layerMask?: number,
        receiveShadows?: number,
        castShadow?: number,
        boundingbox?: {
            center: [number, number, number],
            extents: [number, number, number],
        },
    },
    boundingbox?: {
        center: [number, number, number],
        extents: [number, number, number],
    },
}

export interface INodeOld extends GLTF2.INode {
    animCount?: number,
    boundingbox?: {
        center: [number, number, number],
        extents: [number, number, number],
    },
    meshParticle?: IParticleSystemConfig,
}

export interface INodeNew extends GLTF2.INode {
    extras: {
        animCount?: number,
        boundingbox?: {
            center: [number, number, number],
            extents: [number, number, number],
        },
        meshParticle?: IParticleSystemConfig,
        cell?: [number, number]; // image cell - 外部拓展
        light?: number,
    },
    extensions?: {
        [key: string]: any,
        KHR_lights_punctual: GLTF2.IKHRLightsPunctual_LightReference,
    }
}

export interface IPITextureInfo extends GLTF2.ITextureInfo {
    extras: {
        hasAlpha?: boolean,
        offset?: [number, number],
        scale?: [number, number],
        level?: number,
    }
}

export interface IMainOpacityMaterial extends IMaterialData {
    alpha?: number,
    alphaCutOff?: number,
    alphaMode?: number,
    zWrite?: 1 | undefined,
    cull?: string,
    renderQueue?: number,

    diffuseTexture: IPiTextureInfo,
    diffuseLevel?: number,
    diffuseOV?: number,
    diffuseOU?: number,

    opacityTexture?: IPiTextureInfo,
    opacityLevel?: number,
    opacityOV?: number,
    opacityOU?: number,

    // emissionTexture?: IPiTextureInfo,
    // emissiveMapLevel?: number,
    // emissionOU?: number,
    // emissionOV?: number,

    diffuseColor: [number, number, number, number],
    emissionColor: [number, number, number, number],
}

export interface IMainOpacityOpacityFresnelMaterial extends IMainOpacityMaterial {
    // Opacity Fresnel
    OFBias?: number,
    OFPower?: number,
    OFLeft?: [number, number, number],
    OFRight?: [number, number, number],
}

export interface IMainOpacityEmissiveFresnelMaterial extends IMainOpacityMaterial {
    // Fresnel
    EFBias?: number,
    EFPower?: number,
    EFLeft?: [number, number, number],
    EFRight?: [number, number, number],
}

export interface IOpacityClipMaterial extends IMainOpacityMaterial {
}

export interface ITwoOpacityMixMaterial extends IMaterialData {
    alpha?: number,
    alphaCutOff?: number,
    alphaMode?: number,
    zWrite?: 1 | undefined,
    cull?: string,
    renderQueue?: number,

    diffuseTexture: IPiTextureInfo,
    diffuseLevel?: number,
    diffuseOV?: number,
    diffuseOU?: number,

    opacityTexture: IPiTextureInfo,
    opacityLevel?: number,
    opacityOV?: number,
    opacityOU?: number,

    diffuseColor: [number, number, number, number],
    emissionColor: [number, number, number, number],

    // _ClipEdgeColor
    coEColor?: [number, number, number, number],
    // _ClipEdgeThickness
    coET?: number,
    // _ClipEdgeLevel
    coE?: number,
    // _ClipEdgeAlphaDiff
    coEAD?: number,

    // mixOpacityUScale
    MixOUS: number,
    // mixOpacityVScale
    MixOVS: number,
    // mixOpacityUOffset
    MixOUO: number,
    // mixOpacityVOffset
    MixOVO: number,
    // mixOpacityUSpeed
    MixOUSp: number,
    // mixOpacityVSpeed
    MixOVSp: number,
    // mixOpacityLevel
    MixOIns: number,
    // mixOpacityControlUScale
    MixCUS: number,
    // mixOpacityControlVScale
    MixCVS: number,
    // mixOpacityControlUOffset
    MixCUO: number,
    // mixOpacityControlVOffset
    MixCVO: number,
    // mixOpacityControlLevel
    MixCIns: number,
    // mixOpacityControlValue
    MixCVal: number,
}


export interface IDistortionUVMaterial extends IMaterialData {
    alpha?: number,
    alphaCutOff?: number,
    alphaMode?: number,
    zWrite?: 1 | undefined,
    cull?: string,
    renderQueue?: number,
    diffuseTexture: IPiTextureInfo,
    diffuseLevel?: number,
    maskTexture?: IPiTextureInfo,
    mask2Texture?: IPiTextureInfo,
    opacityTexture: IPiTextureInfo,
    opacityLevel?: number,
    distortionX: number,
    distortionY: number,
    distortionSX: number,
    distortionSY: number,
    maskFlowMode: 0 | 1,
    vertexColorFactor: number,
    opacityFromMaskBlue: number,
    diffuseColor: [number, number, number, number],
}

export type IGLTF = IGLTFNew;