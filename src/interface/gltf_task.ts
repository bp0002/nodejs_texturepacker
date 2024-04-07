export interface IGLTFTaskConfig {
    "srcDir": string,
    "target": string,
    "name": string,
    /**
     * 与 alignSize 互斥, pot 优先级更高
     */
    "pot": boolean,
    /**
     * Task 是否激活 tag 分析 - 具有相同 tag 的目标将合并到同一个文件
     * 暂未支持 - 当前可工具文件夹分类, 配置不同任务实现
     */
    "useTag": boolean,
    /**
     * 标记的矩形将具有从属 bin，如果设置为“false”，则 Packer 将尝试将标记矩形放入同一个 bin 中
     */
    "exclusiveTag": boolean,
    /**
     * Task 是否输出为方型
     */
    "square": boolean,
    /**
     * 与 pot 互斥, pot 优先级更高
     */
    "alignSize": number,
    "maxWidth": number,
    "maxHeight": number,
    "logMergy": boolean,
    "logCollect": boolean,
    "active": boolean,
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