"use strict";
exports.__esModule = true;
exports.EInterpolationGradienMode = exports.EInterpolationCurveMode = exports.RandomUnit = exports.DefaultValue = exports.TParamTextureSheet = exports.TParamRotationOverLifetime = exports.TParamSizeOverLifetime = exports.TParamColorOverLifetime = exports.TParamForceOverLifetime = exports.TParamLimitVelocityOverLifetime = exports.TParamVelocityOverLifetime = exports.TParamGravity = exports.TParamStartRotation = exports.TParamStartSize = exports.TParamStartLifetime = exports.TParamStartSpeed = exports.TParamStartColor = exports.TEmissionIndexBursts = exports.TEmissionIndexRate = exports.TInterpolateRandom = exports.TInterpolateTwoGradients = exports.TInterpolateGradient = exports.TInterpolateTwoColors = exports.TInterpolateColor = exports.TInterpolateTwoCurves = exports.TInterpolateCurve = exports.TInterpolateTwoConstants = exports.TInterpolateConstant = exports.TShapeArcModeBurstSpread = exports.TShapeArcModePingPong = exports.TShapeArcModeLoop = exports.TShapeArcModeRandom = exports.TShapeTypeRectangle = exports.TShapeTypeEdge = exports.TShapeTypeHemisphere = exports.TShapeTypeCircle = exports.TShapeTypeBox = exports.TShapeTypeSphere = exports.TShapeTypeCone = void 0;
/**
 * 形状发射器类型
 */
exports.TShapeTypeCone = 0;
exports.TShapeTypeSphere = 1;
exports.TShapeTypeBox = 2;
exports.TShapeTypeCircle = 3;
exports.TShapeTypeHemisphere = 4;
exports.TShapeTypeEdge = 5;
exports.TShapeTypeRectangle = 6;
/**
 * ArcMode 类型
 */
exports.TShapeArcModeRandom = 1;
exports.TShapeArcModeLoop = 2;
exports.TShapeArcModePingPong = 3;
exports.TShapeArcModeBurstSpread = 4;
/**
 * 曲线类型
 */
exports.TInterpolateConstant = 1;
exports.TInterpolateTwoConstants = 2;
exports.TInterpolateCurve = 4;
exports.TInterpolateTwoCurves = 8;
/**
 * 渐变类型
 */
exports.TInterpolateColor = 1;
exports.TInterpolateTwoColors = 2;
exports.TInterpolateGradient = 4;
exports.TInterpolateTwoGradients = 8;
exports.TInterpolateRandom = 16;
/**
 * josn数据中 Emission 数据Index类型
 */
exports.TEmissionIndexRate = 0;
exports.TEmissionIndexBursts = 1;
/**
 * 曲线参数类型
 */
exports.TParamStartColor = 1;
exports.TParamStartSpeed = 2;
exports.TParamStartLifetime = 3;
exports.TParamStartSize = 4;
exports.TParamStartRotation = 5;
exports.TParamGravity = 6;
exports.TParamVelocityOverLifetime = 7;
exports.TParamLimitVelocityOverLifetime = 8;
exports.TParamForceOverLifetime = 9;
exports.TParamColorOverLifetime = 10;
exports.TParamSizeOverLifetime = 11;
exports.TParamRotationOverLifetime = 12;
exports.TParamTextureSheet = 13;
/**
 * 默认数据配置
 */
exports.DefaultValue = {
    duration: 5,
    startSpeed: 1,
    startLifetime: 2,
    textureSheetFrame: 0,
    startSize: [1, 1, 1],
    startRotation: [0, 0, 0],
    startColor: [1, 1, 1, 1],
    gravity: [0, 0, 0],
    velocityOverLifetime: [0, 0, 0],
    limitVelocityOverLifetime: [999999, 999999, 999999],
    limitVelocityOverLifetimeDampen: 0,
    forceOverLifetime: [0, 0, 0],
    colorOverLifetime: [1, 1, 1, 1],
    sizeOverLifetime: [1, 1, 1],
    rotationOverLifetime: [0, 0, 0]
};
/**
 * 曲线插值模式
 */
var RandomUnit;
(function (RandomUnit) {
    RandomUnit[RandomUnit["One"] = 1] = "One";
    RandomUnit[RandomUnit["Three"] = 3] = "Three";
})(RandomUnit = exports.RandomUnit || (exports.RandomUnit = {}));
/**
 * 曲线插值模式
 */
var EInterpolationCurveMode;
(function (EInterpolationCurveMode) {
    /**
     * 静态数值
     */
    EInterpolationCurveMode[EInterpolationCurveMode["Constant"] = exports.TInterpolateConstant] = "Constant";
    /**
     * 静态数值随机 - XYZ 随机值相同
     */
    EInterpolationCurveMode[EInterpolationCurveMode["TwoConstants"] = exports.TInterpolateTwoConstants] = "TwoConstants";
    /**
     * 曲线插值
     */
    EInterpolationCurveMode[EInterpolationCurveMode["Curve"] = exports.TInterpolateCurve] = "Curve";
    /**
     * 曲线插值
     */
    EInterpolationCurveMode[EInterpolationCurveMode["TwoCurves"] = exports.TInterpolateTwoCurves] = "TwoCurves";
})(EInterpolationCurveMode = exports.EInterpolationCurveMode || (exports.EInterpolationCurveMode = {}));
/**
 * 渐变插值模式
 */
var EInterpolationGradienMode;
(function (EInterpolationGradienMode) {
    /**
     * 静态数值
     */
    EInterpolationGradienMode[EInterpolationGradienMode["Color"] = exports.TInterpolateColor] = "Color";
    /**
     * 静态数值随机 - XYZ 随机值相同
     */
    EInterpolationGradienMode[EInterpolationGradienMode["TwoColors"] = exports.TInterpolateTwoColors] = "TwoColors";
    /**
     * 曲线插值
     */
    EInterpolationGradienMode[EInterpolationGradienMode["Gradient"] = exports.TInterpolateGradient] = "Gradient";
    /**
     * 曲线插值
     */
    EInterpolationGradienMode[EInterpolationGradienMode["TwoGradients"] = exports.TInterpolateTwoGradients] = "TwoGradients";
    /**
     * 曲线插值
     */
    EInterpolationGradienMode[EInterpolationGradienMode["Random"] = exports.TInterpolateRandom] = "Random";
})(EInterpolationGradienMode = exports.EInterpolationGradienMode || (exports.EInterpolationGradienMode = {}));
