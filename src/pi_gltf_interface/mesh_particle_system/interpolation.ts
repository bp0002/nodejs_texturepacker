
//#region 曲线数据属性值类型

import { EInterpolationCurveMode, EInterpolationGradienMode } from "./iparticle_system_config";

/**
 * 时间点
 */
type TCurveTime = number;
/**
 * 当前时间点对应值
 */
type TCurveValue = number;
/**
 * 当前时间点的进入时切线斜率
 */
type TCurveInTangent = number;
/**
 * 当前时间点的离开时切线斜率
 */
type TCurveOutTangent = number;
/**
 * 曲线模式
 */
type TCurveMode = number;
//#endregion

//#region 曲线关键帧 各属性数据在 数组中的序号描述
/**
 * 关键帧 时间信息 的数组序号
 */
const KeyIndexFrame = 0;
/**
 * 关键帧 值信息 的数组序号
 */
const KeyIndexValue = 1;
/**
 * 关键帧 InTangent 的数组序号
 */
const KeyIndexInTangent = 2;
/**
 * 关键帧 OutTangent 的数组序号
 */
const KeyIndexOutTangent = 3;
/**
 * 关键帧 曲线模式 的数组序号
 */
const KeyIndexMode = 4;
/**
 * 曲线 关键帧信息 - 数组形式
 */
export type ICurveKey  = [TCurveTime, TCurveValue, TCurveInTangent?, TCurveOutTangent?, TCurveMode?];
//#endregion

/**
 * Enum for the animation key frame interpolation type
 */
export enum AnimationKeyInterpolation {
    /**
     * Do not interpolate between keys and use the start key value only. Tangents are ignored
     */
    STEP = 1
}

/**
 * 插值工具模块描述
 */
export interface IInterpolation<T> {
    /**
     * 插值模式
     */
    mode: EInterpolationCurveMode | EInterpolationGradienMode;
    /**
     * 插值接口
     * @param progress 插值因子
     */
    interpolate(progress: number, random: number): T;
    /**
     * 销毁
     */
    dispose(): void;
}

//#region 曲线信息描述
/**
 * 曲线 关键帧信息数组 在曲线信息 数据中的序号
 */
const CurveIndexKeys = 0;
/**
 * 曲线 值域缩放数据 在曲线信息 数据中的序号
 */
const CurveIndexScalar = 1;
/**
 * 曲线 值域缩放数据 值类型
 */
type TCurveScalar = number;
/**
 * 曲线信息 数据 - 数组形式
 */
export type ICurve = [ICurveKey[], TCurveScalar];
//#endregion

//#region 可插值数据 值类型描述
/**
 * 一维插值 数据类型
 */
export type InterpolationData1 = number;
/**
 * 二维插值 数据类型
 */
export type InterpolationData2 = [number, number];
/**
 * 三维插值 数据类型
 */
export type InterpolationData3 = [number, number, number];
/**
 * 四维插值 数据类型
 */
export type InterpolationData4 = [number, number, number, number];
//#endregion

//#region 渐变信息描述
/**
 * 渐变控制点 时间 数据类型
 */
type TGradientTime = number;
/**
 * 渐变控制点 值 数据类型
 */
type TGradientValue = number;
/**
 * 渐变控制点 时间 数据在渐变信息中的序号
 */
const GradientIndexFrame = 0;
/**
 * 渐变控制点 值 数据在渐变信息中的序号
 */
const GradientIndexValue = 1;
/**
 * 渐变控制点数据 - 数组形式
 */
export type IGradient = [TGradientTime, TGradientValue];
export type IGradient4 = [IGradient[], IGradient[], IGradient[], IGradient[]];