"use strict";
//#region 曲线数据属性值类型
exports.__esModule = true;
exports.AnimationKeyInterpolation = void 0;
//#endregion
//#region 曲线关键帧 各属性数据在 数组中的序号描述
/**
 * 关键帧 时间信息 的数组序号
 */
var KeyIndexFrame = 0;
/**
 * 关键帧 值信息 的数组序号
 */
var KeyIndexValue = 1;
/**
 * 关键帧 InTangent 的数组序号
 */
var KeyIndexInTangent = 2;
/**
 * 关键帧 OutTangent 的数组序号
 */
var KeyIndexOutTangent = 3;
/**
 * 关键帧 曲线模式 的数组序号
 */
var KeyIndexMode = 4;
//#endregion
/**
 * Enum for the animation key frame interpolation type
 */
var AnimationKeyInterpolation;
(function (AnimationKeyInterpolation) {
    /**
     * Do not interpolate between keys and use the start key value only. Tangents are ignored
     */
    AnimationKeyInterpolation[AnimationKeyInterpolation["STEP"] = 1] = "STEP";
})(AnimationKeyInterpolation = exports.AnimationKeyInterpolation || (exports.AnimationKeyInterpolation = {}));
//#region 曲线信息描述
/**
 * 曲线 关键帧信息数组 在曲线信息 数据中的序号
 */
var CurveIndexKeys = 0;
/**
 * 曲线 值域缩放数据 在曲线信息 数据中的序号
 */
var CurveIndexScalar = 1;
/**
 * 渐变控制点 时间 数据在渐变信息中的序号
 */
var GradientIndexFrame = 0;
/**
 * 渐变控制点 值 数据在渐变信息中的序号
 */
var GradientIndexValue = 1;
