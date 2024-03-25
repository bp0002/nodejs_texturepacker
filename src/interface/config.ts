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
     * 输出: 项目src相对该配置文件路径
     */
    "projectSrc": string,
    /**
     * 输出: 文件夹的项目路径
     */
    "target": string,
    /**
     * 输出: 保存的文件名
     */
    "name": string,
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
