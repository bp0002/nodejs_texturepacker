# 该库与项目同文件夹时
* 项目根目录下创建 texturepacker.json , 声明任务列表
```typescript
export interface ITexturePackTask {
    /**
     * 是否裁剪透明像素
     */
    "trim": boolean,
    /**
     * 是否以rgb灰度计算 半透明信息
     */
    "transparencyFromGray"?: boolean,
    /**
     * 半透明 Trim 阈值 - 小于该值被剔除
     * 0 - 255
     */
    "transparencyThreshold": number,
    /**
     * 是否在装箱算法中使用 旋转支持 以获得更小的打包尺寸
     */
    "rotation": boolean,
    /**
     * Task 是否输出为方型
     */
    "square": boolean,
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
     * 输出: 保存的文件名, 当为设置 subFolders 时, 内部认为必要时合并到多张输出,输出名称将有后缀 _{n}， Example: a_0.png, a_1.png ...
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
        "subFolderNameAsAnimName": boolean;
        /**
         * 是否 压缩 数据
         */
        "optCompact": boolean;
        /**
         * 压缩 数据 时 是否压缩 帧名称 - 帧名称被替换为 0,1,2....
         */
        "optCompactFrameName": boolean;
    },
    /**
     * 图片是否已被Y轴翻转
     */
    isInvertY?: boolean;
    /**
     * 采样模式
     */
    samplerMode?: number;
    /**
     * 半透明混合模式
     * 1 : One - One
     * 2 : SrcAlpha = OneMinusSrcAlpha
     * 7 : One - OneMinusSrcAlpha
     */
    alphaMode?: number;
    /**
     * 是否不使用 mipmap - 默认 true
     */
    noMipmap?: boolean;
    /**
     * 显示缩放比例
     */
    displayScale?: [number, number],
}
```
```json
[
    {
        "srcDir": "images/role2/",
        "target": "src/assets/",
        "name": "role2",
        "trim": true,
        "rotation": true,
        "alignSize": 4,
        "border": 1,
        "padding": 1,
        "maxWidth": 2048,
        "maxHeight": 2048,
        "active": true,
        "logTrim": false,
        "logCollect": false,
        "logMergy": false,
        "subFolders": {
            "subFolderNameAsAnimName": true
        }
    }
]
```
* 运行
```cmd
tsc ../texturepacker/src/index.ts & node ../texturepacker/src/index.js texturepacker.json
```

## 已合成的行列图集转TexturePacker图集
* 项目根目录下创建 texturepacker_from_packed.json , 声明任务列表

```typescript
interface IFromPackedTask {
    /**
     * 源图片相对路径
     */
    imageSource: string;
    /**
     * 图片存储相对路径
     */
    target: string;
    /**
     * 保持的图集名称
     */
    name: string;
    /**
     * 动画名称
     */
    animName: string;
    /**
     * 行数目
     */
    column: number;
    /**
     * 列数目
     */
    row: number;
    /**
     * 图片是否已被Y轴翻转
     */
    isInvertY: boolean;
    /**
     * 任务是否激活
     */
    active: true;
    /**
     * 任务是否压缩数据
     */
    opt: boolean;
    /**
     * 采样模式
     */
    samplerMode?: number;
    /**
     * 半透明混合模式
     * 1 : One - One
     * 2 : SrcAlpha = OneMinusSrcAlpha
     * 7 : One - OneMinusSrcAlpha
     */
    alphaMode?: number;
    /**
     * 是否不使用 mipmap - 默认 true
     */
    noMipmap?: boolean;
    /**
     * 显示缩放比例
     */
    displayScale?: [number, number],
}
```
```json
[
    {
        "imageSource": "ImageMergy/YaoYaoYin_PoHun_Buff/SnFnXzpUyyzzoKhU3BYeKr.png",
        "target": "src/assets/",
        "name": "YaoYaoYin_PoHun_Buff",
        "animName": "YaoYaoYin_PoHun_Buff",
        "column": 5,
        "row": 5,
        "isInvertY": true,
        "active": true,
        "opt": false,
        "alphaMode": 2,
        "displayScale": [3.48513, 3.48513]
    }
]
```
* 运行
```cmd
tsc ../texturepacker/src/from_packed_image.ts & node ../texturepacker/src/from_packed_image.js texturepacker_from_packed.json
```

##  使用 subFolders 时, (标识将内部帧动画打包)
* [文件夹结构] <image src="./example_folder.png">
* [生成的atlas文件中的动画配置] <image src="./animation.png">
* 项目中加载注册
```typescript
    // 加载并注册精灵图集信息
    GlobalAtlasManager.load("assets/role2.atlas").then(() => {
        // 该图集打包了动画所以可以注册 ModelPrefab, path 为空, fileName 为图集路径, 一般是构建时 target + name + ".png" 
        // 
        prefabPool.registPrefabCfg("role2", { path: "", fileName: "assets/role2.png", single: false, caches: 4 });
        PrefabModelObjPool.registPrefabFactory("role2", ModelPrefab.Creation);
        PrefabModelObjPool.registPrefabResFactory("role2", SpriteModel.Creation);
    });
```
* 项目中使用
```typescript
    // 用作精灵
    var test = wildScene.prefabPool.createPrefab("role2", "role2")
    test.setAnim({ animName: "role2huikan1", isLoop: true })
    test.setAnimeSpeed(0.5)
    test.setPosition(0, 0, 0)
    test.setScale(285, -285, 1);

    // 打包了动画的
    var test = wildScene.prefabPool.createPrefab("role2", "role2")
    test.setAnim({ animName: "role2huikan1", isLoop: true })
    test.setAnimeSpeed(0.5)
    test.setPosition(0, 0, 0)
    test.setScale(285, -285, 1);
```