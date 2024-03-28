export interface IGLTFTaskConfig {
    "srcDir": string,
    "target": string,
    "name": string,
    /**
     * 与 alignSize 互斥, pot 优先级更高
     */
    "pot": boolean,
    /**
     * 与 pot 互斥, pot 优先级更高
     */
    "alignSize": number,
    "maxWidth": number,
    "maxHeight": number,
    "logMergy": boolean,
    "logCollect": boolean,
    "active": Boolean,
    /**
     * Task 合并结果图片边缘透明边界 - Example: 1
     */
    "border": number,
    /**
     * Task 合并时子图之间的间隔 - Example: 1
     */
    "padding": number,
    /**
     * 图片尺寸缩放时最大缩小倍数 1 | 2 | 4
     */
    "maxScaleFator": number,
}