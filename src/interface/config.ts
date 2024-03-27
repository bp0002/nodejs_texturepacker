export interface ITexturePackTask {
    /**
     * 是否裁剪透明像素
     */
    "trim": boolean,
    /**
     * 是否在装箱算法中使用 旋转支持 以获得更小的打包尺寸
     */
    "rotation": boolean,
    /**
     * Task 是否输出为方型
     */
    "square": boolean,
    /**
     * 尺寸是否为2的幂次 - 与alignSize互斥, 同为true时使用 pot
     */
    "pot": boolean,
    /**
     * Task 是否激活 tag 分析 - 具有相同 tag 的目标将合并到同一个文件
     * 暂未支持 - 当前可工具文件夹分类, 配置不同任务实现
     */
    "useTag": boolean,
    /**
     * Task 输出图片的尺寸对齐 - Example: 4, 4 为压缩纹理要求
     */
    "alignSize": number,
    /**
     * Task 合并结果图片边缘透明边界 - Example: 1
     */
    "border": number,
    /**
     * Task 合并时子图之间的间隔 - Example: 1
     */
    "padding": number,
    /**
     * 输入: 文件夹的项目路径
     * * 目标文件夹结构
     * * #英雄名(文件夹)
     * * ###动作1(文件夹)
     * * #----图片序号.png
     * * #----图片序号.png
     * * #----...
     * * ###动作2(文件夹)
     * * #----图片序号.png
     * * #----图片序号.png
     * * #----...
     */
    "srcDir": string,
    /**
     * 输出: 文件夹的项目路径
     */
    "target": string,
    /**
     * Task 是否激活 - 为 false 是不执行
     */
    "active": boolean,
    /**
     * Task 是否打印 Trim 时日志 - 为 true 时执行
     */
    "logTrim": boolean,
    /**
     * Task 是否打印 Collect 时日志 - 为 true 时执行
     */
    "logCollect": boolean,
    /**
     * Task 是否打印 Mergy 时日志 - 为 true 时执行
     */
    "logMergy": boolean,
    /**
     * 输出: 保存的文件名
     */
    "name": string,
    /**
     * 最大尺寸 - 移动端推荐 2048, 可以使用 4096, 8192 等 看看成功时的输出是否超过 2048
     */
    "maxWidth": number,
    /**
     * 最大尺寸 - 移动端推荐 2048, 可以使用 4096, 8192 等 看看成功时的输出是否超过 2048
     */
    "maxHeight": number,
    /**
     * 子文件夹的使用
     * * 可以将 同英雄的不同动作分别放不同文件夹
     */
    "subFolders"?: {
        /**
         * 使用子文件夹名称作为动画名称
         */
        "subFolderNameAsAnimName": boolean
    }
}
