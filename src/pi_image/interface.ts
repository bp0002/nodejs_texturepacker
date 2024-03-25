import * as images from "images";

export enum BOX {
	None,
	Box,
	Size
}

enum ThumbnailZoom {
	One = 0.5,
	Tow = 0.25,
	Three = 0.125,
	Four = 0.0625,
}

/**
 * 纹理压缩格式
 */
enum TextureType {
	PVRTC = "pvrtc",
	ETC1 = "etc1",
	ETC2 = "etc2",
	ASTC = "astc",
	DXT = "s3tc",
}

/**
 * 打包矩形
 */
export interface Rect {
    index?: any; // 用于索引到源（Rect是一个矩形，是一个抽象的概念，与之对应的可能是一个图片，也可能是其它，index用于索引到其具体的实例）
    sign?: string,    // 签名
    w: number;
    h: number;
    area?: number;
}

/**
 * 打包箱子
 */
export interface ResultBox {
    /**
     * 等级
     */
    level: number;
    /**
     * 装入的矩形
     */
    rects: ResultRect[];
    /**
     * 剩余的矩形空间
     */
    spaceList: RectSpace[];
    /**
     * 高度
     */
    height: number;
    /**
     * 宽度
     */
    width: number;

    useArea: number;
}

// 矩形空间
export interface RectSpace {
    x: number;
    y: number;
    w: number;
    h: number;
    level: { x: number, w: number }[]
}

export interface Result {
    ret: ResultBox,
    remainRects: Rect[]
}

/**
 * 打包矩形结果（描述矩形的宽高、在箱子中的偏移）
 */
export interface ResultRect extends Rect {
    x: number;
    y: number;
    area: number;
}

/**
 * 打包矩形结果（描述矩形的宽高、在箱子中的偏移）
 */
export interface ResultRect extends Rect {
    x: number;
    y: number;
    area: number;
}

/**
 * 打包结果中的某个箱子，箱子中装满了矩形
 */
export interface ResultBoxWithUsage extends ResultBox {
	usage?: number; // 利用率
}

/**
 * "_BOX"图层的基本描述
 */
export interface Box {
	width?: number;
	height?: number;
	left?: number;
	top?: number;
	//描述"_BOX"图层是否存在
	isShow?: BOX;

	right?: number;
	bottom?: number;

	index?: number;
	layer?: number;
}

/**
 * 源图片描述
 */
export interface ImgDecs {
	/**
	 * 源图片的左上角 在目标图片中的x偏移
	 */
	left: number;
	/**
	 * 源图片的左上角 在目标图片中的y偏移
	 */
	top: number;
	/**
	 * 源图片宽度
	 */
	w: number;
	/**
	 * 源图片高度
	 */
	h: number;

	/**
	 * 样式名称
	 */
	clazz?: string;//number;

	/**
	 * 如果存在一个外框，需要该字段
	 */
	boxClazz?: string;//number;

	/**
	 * 显示图片时， 在盒子中x轴的偏移
	 */
	ox?: number;
	/**
	 * 显示图片时， 在盒子中y轴的偏移
	 */
	oy?: number;

	// /**
	//  * 如果需要显示为边框图，会导出该字段
	//  */
	// borderSlice?: string;

	/**
	 * 如果需要显示为边框图，会导出该字段
	 */
	borderSlice?: [number, number, number, number, string];

	borderRepeat?: string;

	keyFrameIndex?: number;

	box?: Box;

	hsi?: [number, number, number];

	/**
	 * 目标图片索引（对应groups中的位置）
	 */
	groupI?: number;
}

export interface ImgItem extends ImgDecs {
	/**
	 * 引用图片的路径或或自身路径
	 */
	dir: string;
	/**
	 * 图片名称
	 */
	name: string;
	/**
	 * 后缀
	 */
	type: string;

	/**
	 * 为true时不对图片进行合并
	 */
	notMerge?: boolean,

	/**
	 * buffer对应的图片
	 */
	img?: images.Image,
	/**
	 * 图片面积
	 */
	area?: number,

	fit?: { x: number, y: number },

}

export interface TextureCfg {
	square?: string,
	quality?: string,
}

export interface ImgTextureCfg {
	png?: TextureCfg,
	jpg?: TextureCfg,
}

/**
 * 插件所需参数
 */
export interface TextureArgs {
	ignoreTexture?: TextureType[];
	flipY?: boolean;
	isInit?: boolean;
	textures?: TextureType[];

	// 纹理压缩选项
	astc?: TextureCfg,
	etc1?: TextureCfg,
	etc2?: TextureCfg,
	pvrtc?: TextureCfg,
	s3tc?: TextureCfg,
}

export interface Args extends TextureArgs {
	sizeLimit?: number; // 合并图片尺寸限制，合并后的图片宽高都不能大于该值(如果单张图片本身尺寸大于该限制，则不受该限制的影响，可以与其它图片一起合并成新的图片)
	zoom?: number[];
	padding?: number;
	/**
	 * 缩略图配置
	 */
	thumbnail?: {
		/**
		 * 缩放比率， 为图片生成缩略图，尺寸应该缩放为源图片的多少倍
		 */
		zoom: ThumbnailZoom,
		/**
		 * 如果某图片生成的缩略图，宽度或高度小于该值，则不会对该图片生成缩略图
		 */
		maxLimit: number,
		png?: {
			/**
			 * 缩放比率， 为图片生成缩略图，尺寸应该缩放为源图片的多少倍
			 */
			zoom: ThumbnailZoom,
			/**
			 * 如果某图片生成的缩略图，宽度或高度小于该值，则不会对该图片生成缩略图
			 */
			maxLimit: number,
		},
		jpg?: {
			/**
			 * 缩放比率， 为图片生成缩略图，尺寸应该缩放为源图片的多少倍
			 */
			zoom: ThumbnailZoom,
			/**
			 * 如果某图片生成的缩略图，宽度或高度小于该值，则不会对该图片生成缩略图
			 */
			maxLimit: number,
		},
	};
	css?: boolean,
	pngQuality?: number,
	jpgQuality?: number,
}


export interface WriteResult {
	name?: string,
	dir?: string,
	version?: string,
	cfg?: ImgMapCfg,
	imgs?: any[];
	args: Args,
}


/**
 * 合成图片描述
 */
export interface ImgGroup {
	/**
	 * 图片路径 （相对于项目的根）
	 */
	path: string;
	w: number;
	h: number;
}

/**
 * 源图片描述
 */
export interface ImgDecs {
	/**
	 * 源图片的左上角 在目标图片中的x偏移
	 */
	left: number;
	/**
	 * 源图片的左上角 在目标图片中的y偏移
	 */
	top: number;
	/**
	 * 源图片宽度
	 */
	w: number;
	/**
	 * 源图片高度
	 */
	h: number;

	/**
	 * 样式名称
	 */
	clazz?: string;//number;

	/**
	 * 如果存在一个外框，需要该字段
	 */
	boxClazz?: string;//number;

	/**
	 * 显示图片时， 在盒子中x轴的偏移
	 */
	ox?: number;
	/**
	 * 显示图片时， 在盒子中y轴的偏移
	 */
	oy?: number;

	// /**
	//  * 如果需要显示为边框图，会导出该字段
	//  */
	// borderSlice?: string;

	/**
	 * 如果需要显示为边框图，会导出该字段
	 */
	borderSlice?: [number, number, number, number, string];

	borderRepeat?: string;

	keyFrameIndex?: number;

	box?: Box;

	hsi?: [number, number, number];

	/**
	 * 目标图片索引（对应groups中的位置）
	 */
	groupI?: number;
}

/**
 * 图片描述
 */
export interface ImgInfo extends ImgDecs {
	showW?: number,
	showH?: number,
	boxIndex?: number, // box的索引
	clip: Clip,
	sign?: string   // 图片签名
}

/**
 * 源图片映射
 * 一些ui上的图片重用了icon中的图片， 该配置是两张图的映射关系
 */
export interface ImgMap {
	/**
	 * widget名称，另一个psd的路径，以“-”连接（而非“/”）
	 */
	widget: string,
	/**
	 * 图片名称（在icon psd中的名称）
	 */
	name: string,
	showW?: number,
	showH?: number,
	w?: number,
	h?: number,
	clip: Clip,
	boxIndex?: number,
	ox?: number,
	oy?: number,
}

export interface Clip {
	top: number,
	left: number,
	bottom: number,
	right: number,
	height: number,
	width: number
}

/**
 * 图片映射关系配置
 */
export interface ImgMapCfg {
	// quality: QualityArgs,
	/**
	 * 压缩比率 compressionRatio
	 */
	zoom: number;
	/**
	 * 生成图片集描述
	 */
	groups: ImgGroup[];

	/**
	 * 如果存在时, 该配置中的所有图片都放在该盒子中
	 */
	box?: { w: number, h: number };

	boxs?: { w: number, h: number }[];
	/**
	 * 源图片描述
	 */
	imgs: {
		/**
		 * key为图片名， 值为该图片的详细信息、或对其他图片集中图片的引用、或直接对应本图片集中的某个图片组（该图片组中仅含一张图片）
		 */
		[name: string]: ImgInfo | ImgMap | number;
	};
	// 
	keyFramesMap: {
		[name: string]: keyFrames;
	},
	ignoreTextures?: string[];

	/**
	 * 缩略图的最大尺寸限制
	 */
	thumbnailMaxLimit?: number;

	/**
	 * 缩略图的缩放值
	 */
	thumbnailZoom?: number;
}

export interface keyFrames {
	width: number,
	height: number,
	left: number,
	top: number,
	frames: { left: number/**百分比 */, top: number/**百分比 */, img?: ImgInfo, index: number/**使用图片的帧索引（可能等于自身位置索引，如果与其它图片重复，则为其它帧的索引） */, pos: number, /*0~1之间的数*/ }[],
	animation: string,
}

export interface keyFramesMap {
	[name: string]: keyFrames,
}


export interface LEVEL {
	width: number, height: number, area: number, usage: number
}

/**
 * 排序的比较接口定义
 */
export type SortFunc = (a: SortObj, b: SortObj) => number;

/**
 * 箱子的集合（即打包结果）
 */
export interface BoxCollection {
	usage?: number; // 利用率
	boxs: ResultBoxWithUsage[]; // 打包结果中包含多个箱子
	useArea: number;
}


/**
 * 可排序的对象
 */
export interface SortObj {
	w: number,
	h: number,
	area?: number
}
