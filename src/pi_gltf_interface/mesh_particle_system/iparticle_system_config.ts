import { ICurve, IGradient } from "./interpolation";

/**
 * 形状发射器类型
 */
export const TShapeTypeCone = 0;
export const TShapeTypeSphere = 1;
export const TShapeTypeBox = 2;
export const TShapeTypeCircle = 3;
export const TShapeTypeHemisphere = 4;
export const TShapeTypeEdge = 5;
export const TShapeTypeRectangle = 6;

/**
 * ArcMode 类型
 */
export const TShapeArcModeRandom = 1;
export const TShapeArcModeLoop = 2;
export const TShapeArcModePingPong = 3;
export const TShapeArcModeBurstSpread = 4;

/**
 * 曲线类型
 */
export const TInterpolateConstant = 1;
export const TInterpolateTwoConstants = 2;
export const TInterpolateCurve = 4;
export const TInterpolateTwoCurves = 8;

/**
 * 渐变类型
 */
export const TInterpolateColor = 1;
export const TInterpolateTwoColors = 2;
export const TInterpolateGradient = 4;
export const TInterpolateTwoGradients = 8;
export const TInterpolateRandom = 16;

/**
 * josn数据中 Emission 数据Index类型
 */
export const TEmissionIndexRate = 0;
export const TEmissionIndexBursts = 1;

/**
 * 曲线参数类型
 */
export const TParamStartColor = 1;
export const TParamStartSpeed = 2;
export const TParamStartLifetime = 3;
export const TParamStartSize = 4;
export const TParamStartRotation = 5;
export const TParamGravity = 6;
export const TParamVelocityOverLifetime = 7;
export const TParamLimitVelocityOverLifetime = 8;
export const TParamForceOverLifetime = 9;
export const TParamColorOverLifetime = 10;
export const TParamSizeOverLifetime = 11;
export const TParamRotationOverLifetime = 12;
export const TParamTextureSheet = 13;

/**
 * 默认数据配置
 */
export const DefaultValue = {
    duration: 5,
    startSpeed: 1,
    startLifetime: 2,
    textureSheetFrame: 0,
    startSize: <[number, number, number]>[1, 1, 1],
    startRotation: <[number, number, number]>[0, 0, 0],
    startColor: <[number, number, number, number]>[1, 1, 1, 1],
    gravity: <[number, number, number]>[0, 0, 0],
    velocityOverLifetime: <[number, number, number]>[0, 0, 0],
    limitVelocityOverLifetime: <[number, number, number]>[999999, 999999, 999999],
    limitVelocityOverLifetimeDampen: 0,
    forceOverLifetime: <[number, number, number]>[0, 0, 0],
    colorOverLifetime: <[number, number, number, number]>[1, 1, 1, 1],
    sizeOverLifetime: <[number, number, number]>[1, 1, 1],
    rotationOverLifetime: <[number, number, number]>[0, 0, 0]
};

export type TParamType = typeof TParamStartColor | typeof TParamStartSpeed | typeof TParamStartLifetime | typeof TParamStartSize | typeof TParamStartRotation
    | typeof TParamGravity | typeof TParamVelocityOverLifetime | typeof TParamLimitVelocityOverLifetime
    | typeof TParamForceOverLifetime | typeof TParamColorOverLifetime | typeof TParamSizeOverLifetime | typeof TParamRotationOverLifetime | typeof TParamTextureSheet;

/**
 * 曲线插值模式
 */
 export enum RandomUnit {
    One = 1,
    Three = 3,
}
/**
 * 曲线插值模式
 */
export enum EInterpolationCurveMode {
    /**
     * 静态数值
     */
    Constant = TInterpolateConstant,
    /**
     * 静态数值随机 - XYZ 随机值相同
     */
    TwoConstants = TInterpolateTwoConstants,
    /**
     * 曲线插值
     */
    Curve = TInterpolateCurve,
    /**
     * 曲线插值
     */
    TwoCurves = TInterpolateTwoCurves
}
/**
 * 渐变插值模式
 */
export enum EInterpolationGradienMode {
    /**
     * 静态数值
     */
    Color = TInterpolateColor,
    /**
     * 静态数值随机 - XYZ 随机值相同
     */
    TwoColors = TInterpolateTwoColors,
    /**
     * 曲线插值
     */
    Gradient = TInterpolateGradient,
    /**
     * 曲线插值
     */
    TwoGradients = TInterpolateTwoGradients,
    /**
     * 曲线插值
     */
    Random = TInterpolateRandom
}

/**
 * 形状发射器 Arc 信息
 */
export type IShapeArc = IShapeArcRandom | IShapeArcLoop | IShapeArcPingPong | IShapeArcBurstSpread;
/**
 * 弧度范围发射信息描述 - Random 模式
 */
export interface IShapeArcRandom {
    /**
     * 模式 - EShapeEmitterArcMode.Random
     */
    mode: typeof TShapeArcModeRandom;
    /**
     * 发射的弧形范围
     */
    value: number;
    /**
     * 0~1
     */
    spread: number;
    speed: number;
}
/**
 * 弧度范围发射信息描述 - Lopp 模式
 */
export interface IShapeArcLoop {
    /**
     * 模式 - EShapeEmitterArcMode.Loop
     */
    mode: typeof TShapeArcModeLoop;
    /**
     * 发射的弧形范围 - 角度值
     */
    value: number;
    /**
     * 0~1
     */
    spread: number;
    speed: number;
}
/**
 * 弧度范围发射信息描述 - PingPong 模式
 */
export interface IShapeArcPingPong {
    /**
     * 模式 - EShapeEmitterArcMode.PingPong
     */
    mode: typeof TShapeArcModePingPong;
    /**
     * 发射的弧形范围
     */
    value: number;
    /**
     * 0~1
     */
    spread: number;
    speed: number;
}
/**
 * 弧度范围发射信息描述 - BurstSpread 模式
 */
export interface IShapeArcBurstSpread {
    /**
     * 模式 - EShapeEmitterArcMode.BurstSpread
     */
    mode: typeof TShapeArcModeBurstSpread;
    /**
     * 发射的弧形范围
     */
    value: number;
    /**
     * 0~1
     */
    spread: number;
    speed: number;
}
export type TShapeArcMode  = typeof TShapeArcModeRandom | typeof TShapeArcModeLoop | typeof TShapeArcModePingPong | typeof TShapeArcModeBurstSpread;
/**
 * Cone 形状发射器描述
 */
export interface IShapeCone {
    /**
     * 类型标识
     */
    type: typeof TShapeTypeCone;
    /**
     * 半径
     */
    radius: number;
    /**
     * 角度
     */
    angle: number;
    /**
     * 半径范围
     */
    radiusThickness: number;
    /**
     * 发射弧度信息
     */
    arc: IShapeArc;
    /**
     * 沿高度体积发射
     */
    emitAsVolume: boolean;
    height: number;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
}
/**
 * Sphere 形状发射器描述
 */
export interface IShapeSphere {
    type: typeof TShapeTypeSphere;
    radius: number;
    radiusThickness: number;
    arc: IShapeArc;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
}
/**
 * Box 形状发射器描述
 */
export interface IShapeBox {
    type: typeof TShapeTypeBox;
    isVolume: 0 | 1;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
    boxEmitMode?: 0 | 1 | 2;
}
/**
 * Hemisphere 形状发射器描述
 */
export interface IShapeHemisphere {
    type: typeof TShapeTypeHemisphere;
    radius: number;
    radiusThickness: number;
    arc: IShapeArc;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
}
/**
 * Circle 形状发射器描述
 */
export interface IShapeCircle {
    type: typeof TShapeTypeCircle;
    radius: number;
    radiusThickness: number;
    arc: IShapeArc;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
}
/**
 * Edge 形状发射器描述
 */
export interface IShapeEdge {
    type: typeof TShapeTypeEdge;
    radius: number;
    arc: IShapeArc;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
}
/**
 * Rectangle 形状发射器描述
 */
export interface IShapeRectangle {
    type: typeof TShapeTypeRectangle;
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    alignDir: 0 | 1;
    randomize?: [number, number, number];
}
/**
 * 形状发射器类型限制
 */
export type IShape = IShapeBox | IShapeCircle | IShapeCone | IShapeEdge | IShapeHemisphere | IShapeRectangle | IShapeSphere;

export type OneParam = number;
export type ThreeParam = [number, number, number];
export type FourParam = [number, number, number, number];
export type OneParamCurve = ICurve;
export type ThreeParamCurve = [ICurve, ICurve, ICurve];
export type FourParamCurve = [ICurve, ICurve, ICurve, ICurve];
export type FourGradient = [IGradient[], IGradient[], IGradient[], IGradient[]];
export type OneParamInfo = [1, typeof TInterpolateConstant, OneParam] | [1, typeof TInterpolateTwoConstants, OneParam, OneParam] | [1, typeof TInterpolateCurve, OneParamCurve] | [1, typeof TInterpolateTwoCurves, OneParamCurve, OneParamCurve];
export type ThreeParamInfo = [3, typeof TInterpolateConstant, ThreeParam] | [3, typeof TInterpolateTwoConstants, ThreeParam, ThreeParam] | [3, typeof TInterpolateCurve, ThreeParamCurve] | [3, typeof TInterpolateTwoCurves, ThreeParamCurve, ThreeParamCurve];
export type FourParamInfo = [4, typeof TInterpolateConstant, FourParam] | [4, typeof TInterpolateTwoConstants, FourParam, FourParam] | [4, typeof TInterpolateCurve, FourParamCurve] | [4, typeof TInterpolateTwoCurves, FourParamCurve, FourParamCurve];
export type FourGradientInfo = [4, typeof TInterpolateRandom] | [4, typeof TInterpolateColor, FourParam] | [4, typeof TInterpolateTwoColors, FourParam, FourParam] | [4, typeof TInterpolateGradient, FourGradient] | [4, typeof TInterpolateTwoGradients, FourGradient, FourGradient];

export interface ITextureSheet {
    frameOverTime: OneParamInfo;
    animMode: 0 | 1;
    customRow: number;
    cycles: number;
    rowMode: 0 | 1;
    startFrame: OneParamInfo;
    tilesX: number;
    tilesY: number;
    timeMode: 0 | 1;
}

export interface ITrail {
    ratio: number;
    mode: 0 | 1;
    lifetime: OneParamInfo;
    ribbonCount: number;
    attachRTT: 0 | 1;
    minDist: number;
    worldSpace: 0 | 1;
    dieWith: 0 | 1;
    texMode: 0 | 1;
    sizeAWidth: 0 | 1;
    sizeALifetime: 0 | 1;
    inheritColor: 0 | 1;
    colorOverLife: FourGradientInfo;
    widthOverTrail: OneParamInfo;
    colorOverTrail: FourGradientInfo;
    material: number;
}

/**
 * 粒子系统JSON描述
 */
export interface IParticleSystemConfig {
    instanceID?: string;
    name: string;
    duration: number;
    startDelay: number;
    looping: 0 | 1;
    prewarm: 0 | 1;
    simulationSpaceIsWorld: 0 | 1;
    scalingMode: 0 | 1 | 2;
    renderAlignment: 0 | 1 | 2 | 3 | 4;
    renderMode: 0 | 1 | 2 | 3 | 4;
    stretchedVelocityScale: number;
    stretchedLengthScale: number;
    maxParticles: number;
    startSpeed: OneParamInfo;
    lifetime: OneParamInfo;
    delay: number | [number, number];
    startColor: FourGradientInfo;
    startSize: OneParamInfo | ThreeParamInfo;
    startRotation: OneParamInfo | ThreeParamInfo;
    gravity: OneParamInfo;
    emission: [
        number,
        [number, number, number, number][]?,
    ];
    shape?: IShape;
    velocityOverLifetime?: OneParamInfo | ThreeParamInfo;
    velocityOverLifetimeIsLocal?: 0 | 1;
    limitVelocityOverLifetime?: OneParamInfo;
    limitVelocityOverLifetimeDampen?: number;
    forceOverLifetime?: OneParamInfo | ThreeParamInfo;
    forceSpaceIsLocal?: 0 | 1;
    colorOverLifetime?: FourGradientInfo;
    colorBySpeed?: [FourGradientInfo, number, number];
    sizeOverLifetime?: OneParamInfo | ThreeParamInfo;
    sizeBySpeed?: [OneParamInfo | ThreeParamInfo, number, number];
    rotationOverLifetime?: OneParamInfo | ThreeParamInfo;
    rotationBySpeed?: [OneParamInfo | ThreeParamInfo, number, number];
    textureSheet?: ITextureSheet;
    texture?: string;
    trail?: ITrail;
    orbtialVelocity?: ThreeParamInfo;
    orbitalOffset?: ThreeParamInfo;
    orbitalRadial?: OneParamInfo;
    speedModifier?: OneParamInfo;
    renderPivot?: [number, number, number];
    custom1?: [OneParamInfo, OneParamInfo, OneParamInfo, OneParamInfo];
}