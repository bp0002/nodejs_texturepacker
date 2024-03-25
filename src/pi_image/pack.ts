import { Boxer } from "./boxer";
import { Box, BoxCollection, LEVEL, Rect, Result, ResultBox, ResultBoxWithUsage, ResultRect, SortFunc } from "./interface";
import { power2Up } from "./utils";

export class Packer {
	padding: number;
	// 尺寸限制, 外部可以限制打包箱子的尺寸
	sizeLimit: number = 1024;
	// 打包矩形之间的间隔
	private paddingTow: number;
	// 打包
	private boxing: Boxer;
	private sortFuncs: SortFunc[]

	private sizeNormalize: (s: number) => number = (s: number) => {
		return s
	};

	constructor(padding = 0, sizeLimit = 1024, sortFuncs: SortFunc[] = [sortFuncDefault]) {
		this.padding = padding;
		this.sizeLimit = sizeLimit;
		this.paddingTow = this.padding * 2;
		if (PACK_LEVEL.length === 0) {
			initLevel(1 * 1);
			// console.log(PACK_LEVEL);
		}
		this.sortFuncs = sortFuncs;
		this.boxing = new Boxer(padding);
	}

	/**
	 * 设置一个函数，将箱子的尺寸规范为该函数要求的尺寸
	 * 如一些箱子的尺寸可能要求2的幂次方，或4的倍数（常见场景如压缩纹理）
	 * @param f 
	 */
	setSizeNormalize(f: (s: number) => number) {
		if (f) {
			this.sizeNormalize = f;
		}
	}

	/**
	 * 打包矩形，允许有一个矩形集合不可拆分
	 * @param rects 
	 * @param small 
	 * @param isOptimize 
	 */
	public merge_pack = (rects: Rect[], noSplitRects: Rect[], isOptimize = true): BoxCollection => {

		return null;
	}

	/**
	 * 将矩形打包到一个箱子中， 如果装不下，返回null
	 */
	public packOnlyOne(rects: Rect[]): Box {
		let retBoxs: ResultBox;
		if (rects.length === 0) {
			throw new Error("数组长度为0， 不需要打包！！！");
		}
		for (let sortFunc of this.sortFuncs) {
			// 对矩形进行排序
			sortRect(rects, sortFunc);
			let levelLimit = this.checkLevel(rects, 1.0);// 严格按照矩形总面积选择打包等级

			let remainRects = rects;
			while (remainRects && remainRects.length > 0 && PACK_LEVEL[levelLimit].area <= this.sizeLimit * this.sizeLimit) {
				let box = PACK_LEVEL[levelLimit];
				let ret = this.boxing.packBox(rects, box.width, box.height);
				remainRects = ret.remainRects;
				levelLimit += 1;
				retBoxs = ret.ret;
			}

			if (!remainRects || remainRects.length === 0) {
				this.calceUsage(retBoxs);
				return retBoxs;
			} else {
				return null;
			}

		}

		return null;
	}

	/**
	 * 将矩形打包到尽量少的箱子中
	 */
	public packWithLess(rects: Rect[]): BoxCollection {
		let retBoxs: ResultBox[] = [];
		if (rects.length === 0) {
			return { boxs: retBoxs, useArea: 0, usage: 0 };
		}
		// for(let sortFunc of this.sortFuncs) {
		let remainArea = 0, maxW: number = 0, maxH: number = 0, remainRects = rects;
		remainRects.forEach((r) => {
			r.area = (r.h + this.paddingTow) * (r.w + this.paddingTow);
			remainArea += r.area;
			maxW = Math.max(maxW, r.w);
			maxH = Math.max(maxH, r.h)
		});

		// 对矩形进行排序
		sortRect(rects, sortFuncDefault);

		let preMain = 0, preRet: Result = null;
		while (remainRects && remainRects.length > 0) {
			let box = this.checkBoxByMain(rects, 'w', preMain, maxW + this.paddingTow, maxH + this.paddingTow, remainArea);// 严格按照矩形总面积选择打包等级
			if (!box) {
				// 无法升级打包, 记录上次的打包结果，继续打包剩余部分
				remainRects = preRet.remainRects;
				this.cutBox(preRet.ret);
				retBoxs.push(preRet.ret);
				preRet = null;
				remainArea = maxH = maxW = 0;
				remainRects.forEach((r) => {
					remainArea += r.area;
					maxW = Math.max(maxW, r.w);
					maxH = Math.max(maxH, r.h)
				});
				preMain = 0;
				continue;
			}
			preMain = box.w;

			let ret = this.boxing.packBox(remainRects, box.w, box.h);
			if (ret.remainRects.length > 0) { // 如果还有剩余，则重新打包（尽可能打成一个box，除非一个box装不下）
				preRet = ret;
				continue;
			}

			// 成功打包成一个box
			retBoxs.push(ret.ret);
			this.cutBox(ret.ret);
			break;
		}

		let retBoxs1: BoxCollection = { boxs: retBoxs, useArea: 0 };
		calcBoxsUsage(retBoxs1);
		return retBoxs1;
	}

	// 裁剪箱子
	cutBox(box: ResultBox) {
		let w: number = 0, h: number = 0;
		for (let rect of box.rects) {
			w = Math.max(rect.x + rect.w, w);
			h = Math.max(rect.y + rect.h, h);
		}
		box.width = this.sizeNormalize(w);
		box.height = this.sizeNormalize(h);
	}

	/**
	 * 打包矩形
	 * @param rects 需要打包的矩形
	 * @param isOptimize 是否优化利用率偏低的箱子（优化方式为：拆分该箱子，对箱子进行降级打包，得到多个箱子，保留利用率高的打包结果）
	 * @return 打包结果（箱子的集合）
	 */
	public pack(rects: Rect[], isOptimize = true): BoxCollection {
		let rects1 = rects as Rect[];
		if (rects.length === 0) {
			return { usage: 0, boxs: [], useArea: 0 };
		}

		// 计算面积
		for (let i = 0; i < rects1.length; i++) {
			rects1[i].area = (rects1[i].h + this.paddingTow) * (rects1[i].w + this.paddingTow);
		}

		let retBoxs: BoxCollection;
		for (let sortFunc of this.sortFuncs) {
			// 对矩形进行排序
			sortRect(rects1, sortFunc);
			//打包
			let retBoxs1: BoxCollection = { boxs: this.pack1(rects1, isOptimize), useArea: 0 };
			// 计算打包结果的利用率
			calcBoxsUsage(retBoxs1);
			// 如果新的打包顺序利用率更高，则替换原来的
			if (!retBoxs || retBoxs1.usage > retBoxs.usage) {
				retBoxs = retBoxs1;
			}
		}


		return retBoxs;
	}

	/**
	 * 按照给定矩形的顺序，对矩形进行打包
	 */
	public pack1(rects: Rect[], isOptimize = true): ResultBoxWithUsage[] {
		// 打包结果集和,打包结果可能包含多个箱子
		let retBoxs: ResultBoxWithUsage[] = [];

		// 进行初始打包
		this.packBoxs(rects, PACK_LEVEL.length, retBoxs);

		// 检查打包箱子利用率，如果利用率低，增加一个打包级别，将该打包结果中的矩形重新打包，对新的打包结果再次执行该步骤，直到打包级别无法增加或新的打包结果利用率低于原打包结果
		let nextLevel: number, rePackBox: ResultBoxWithUsage, rePackIndex: number = 0, area: number;

		// 计算利用率
		for (let r of retBoxs) {
			this.calceUsage(r);
		}

		// 如果需要优化利用率，则编辑打包集合，将利用率偏低的箱子拆箱，重新打包
		if (!isOptimize || retBoxs.length === 0) {
			return retBoxs;
		}

		// 利用率偏低，优化
		for (; rePackIndex < retBoxs.length;) {
			rePackBox = retBoxs[rePackIndex];
			nextLevel = rePackBox.level - 1;

			while (nextLevel >= 0) {
				// 判断可重新打包的箱子的利用率，当前利用率小于满意的利用率，尝试拆解该箱子，对拆解出的项进行降级打包。
				if (rePackBox.usage < PACK_LEVEL[rePackBox.level].usage) {
					let boxWidth = PACK_LEVEL[nextLevel].width;
					let boxHeight = PACK_LEVEL[nextLevel].height;
					let limit = this.checkResultLimit(rePackBox.rects);
					// 利用率过低，在重新打包之前，判断被打包矩形的宽度和高度，如果存在一个矩形宽度或高度大于新打包级别的尺寸，则无法降级打包
					if (boxWidth >= limit.w && boxHeight >= limit.h) {
						// 从打包结果集合中删除这个需要重新打包的箱子
						retBoxs.splice(rePackIndex, 1);
						let startIndex = retBoxs.length;
						// 对该箱子拆分，然后重新打包，其结果放入原打包结果集合之后
						this.packBoxs(rePackBox.rects, nextLevel, retBoxs);

						// 计算新的打包利用率
						let allArea = 0;
						for (let i = startIndex; i < retBoxs.length; i++) {
							let it = retBoxs[i];
							this.calceUsage(it);
							allArea += it.width * it.height;
						}
						let newUseRatio = rePackBox.useArea / allArea;

						if (rePackBox.usage < newUseRatio ||
							(rePackBox.usage == newUseRatio && retBoxs.length - startIndex === 1)) {
							// 如果新的利用率高于原利用率
							// 或者前后利用率相等，并且新的打包也只打包出一个箱子
							// 则保留当前打包结果，继续处理当前打包结果中的最后一个箱子
							break;
						} else {
							// 否则，回退到重新打包之前的状态，并结束打包
							retBoxs.length = startIndex; // 删除新的打包结果
							retBoxs.splice(rePackIndex, 0, rePackBox); // 插入旧的打包结果

							// 继续迭代下一个
							rePackIndex += 1;
							break;
						}
					} else if (boxWidth < limit.w && boxHeight < limit.h) {
						// 宽高限制都不满足，不需要在寻找合适的打包等级，直接迭代下一个
						rePackIndex += 1;
						break;
					} else {
						nextLevel -= 1;
						continue;
					}
				} else {
					// 利用率满意，继续迭代下一个
					rePackIndex += 1;
					break;
				}
			}

			// 没有找到合适的降级打包等级，则进入下一个箱子的优化
			if (nextLevel === -1) {
				rePackIndex += 1;
			}
		}
		return retBoxs;
	}

	// 计算利用率
	calceUsage(box: ResultBoxWithUsage) {
		let area = 0;
		for (let rect of box.rects) {
			area += rect.area;
		}

		box.useArea = area;
		box.usage = area / (box.width * box.height)
	}

	/**
	 * 给定n个打包矩形，将其打包到x个箱子中
	 * @param rects 打包矩形
	 * @param levelLimit 对打包等级的限制，打包箱子对应等级不能超过levelLimit， 如果不希望限制，则传入比PACK_LEVEL长度大的值。
	 * -------------------不对打包等级进行限制，打包将根据当前矩形的情况，预估一个适合的箱子进行打包
	 * @param retBoxs 将放入所有得到的结果箱子
	 */
	packBoxs(rects: Rect[], levelLimit: number, retBoxs: Box[]) {
		let arr = rects, level: number;

		while (arr.length > 0) {
			level = this.checkLevel(arr);
			if (level === undefined) {
				throw new Error("无法找到一个合适的打包箱子！");
			}
			// 在自动选择的（根据当前打包矩形，预估的选择）打包箱子和外部约束的打包箱子中，选择尺寸更小的（外部约束优先）。
			let level1 = Math.min(level, levelLimit);
			let box = PACK_LEVEL[level1];
			let { ret, remainRects } = this.boxing.packBox(arr, box.width, box.height);
			ret.level = level1;
			arr = remainRects;
			retBoxs.push(ret);
		}
	}

	// 为打包矩形选择打包等级，
	// 打包原则：
	// 	1.尽量容纳更多的打包矩形。（即尽量大的箱子，使得最后的打包结果的箱子数目更少）
	//  2.原则上希望选择更大的箱子，但尽量不要超过外部要求的最大箱子（外部可能不希望单个箱子过大，外部可通过sizeLimit来约束）
	//  3.尽管外部可以约束打包的最大箱子，但是如果单个矩形的尺寸已经超过sizeLimit对应的尺寸，则不能满足外部的约束，
	//  --此时打包箱子不必满足sizeLimit的限制，而必须能够容纳最大的项。
	checkLevel(rects: Rect[], areaExtend = 0.8/** 面积可适当放宽限制，默认为0.8， 表示当前所有矩形面积一定小于等于箱子面积的0.8倍 */): number {
		let area = 0, level = PACK_LEVEL.length - 1, isFind: boolean, maxW = rects[0], maxH = rects[0];
		// 找到最大宽度、高度、以及面积和
		for (let rect of rects) {
			area += rect.area;
			if (maxW.w < rect.w || (maxH.w === rect.w && maxH.h < rect.h)) {
				maxW = rect;
			}

			if (maxH.h < rect.h || (maxH.h === rect.h && maxH.w < rect.w)) {
				maxH = rect;
			}
		}
		area /= areaExtend; // 将面积的限制放宽松一点

		// 找到与面积和接近的打包箱子等级（该箱子尽量容纳最大打包项，除非已经到达可选择的箱子的面积极限）
		for (let i = level; i >= 0; --i) {
			// 无法容纳最大的箱子，继续寻找
			if (!this.isContainsMax(maxW, maxH, PACK_LEVEL[i])) {
				continue;
			}
			isFind = true;

			if (area > PACK_LEVEL[i].area) {
				break;
			}

			level = i;
		}

		for (let i = level; i >= 0; --i) {
			// 无法容纳最大的箱子，继续寻找
			if (!this.isContainsMax(maxW, maxH, PACK_LEVEL[i])) {
				continue;
			}
			isFind = true;
			level = i;
			// 宽度或高度符合外部的尺寸限制，重新设置level，并停止寻找
			if (PACK_LEVEL[i].width <= this.sizeLimit && PACK_LEVEL[i].height <= this.sizeLimit) {
				break;
			}
		}



		if (isFind) {
			return level;
		} else {
			return undefined;
		}
	}

	// 选择箱子，该箱子是非2的幂次方
	checkBoxByMain(rects: Rect[], key: "w" | 'h', pre: number/**上一次的值 */, maxMain: number, maxCross: number, area: number/**总面积 */) {
		let main = pre, cross = 0, mianSum = 0, r: { w: number, h: number };
		if (pre === 0 && maxMain >= this.sizeLimit) {// maxMain大于等于sizeLimit，直接使用maxMain的箱子
			r = { w: maxMain, h: Math.max(this.sizeLimit, maxCross) };
		} else if (pre >= this.sizeLimit) { // 上次打包的箱子太大，不能找到更大的箱子
			return null;
		} else {
			// 按照宽
			if (key === 'w') {
				for (let rect of rects) {
					mianSum += rect[key]; // 和
					mianSum += this.paddingTow;

					if (mianSum > pre) {
						if (mianSum > maxMain && mianSum > this.sizeLimit) {
							mianSum -= this.paddingTow + rect[key];
							continue;
						}
						main = mianSum;
						cross = Math.ceil(area / main);
						if (cross > maxCross && cross > this.sizeLimit) { // 箱子过大，重新寻找
							continue;
						}

						if (key === 'w') {
							r = { w: main, h: Math.max(this.sizeLimit, maxCross) };
							break;
						}
						// 如果cross大于this.sizeLimit，尝试到更小的cross
					}
				}
			}

			if (main !== pre) {
				r = { w: main, h: Math.max(this.sizeLimit, maxCross) };
			} else if (maxMain < this.sizeLimit && pre < this.sizeLimit) {
				// 没找到更大的箱子，上一次的箱子小于尺寸限制
				r = { w: this.sizeLimit, h: Math.max(this.sizeLimit, maxCross) };
			}
		}

		if (r) {
			return { w: this.sizeNormalize(r.w), h: this.sizeNormalize(r.h) }
		} else {
			return null;
		}
	}

	/**
	 * 返回打包结果中矩形的最大的宽度或高度
	 */
	checkResultLimit = (rects: ResultRect[]): { w: number, h: number } => {
		let maxW = 0, maxH = 0;
		for (let rect of rects) {
			maxW = Math.max(maxW, rect.w + this.paddingTow);
			maxH = Math.max(maxH, rect.h + this.paddingTow);
		}
		return { w: maxW, h: maxH };
	}

	// 检查箱子是否能够容纳矩形列表中最大的矩形
	isContainsMax(maxW: Rect, maxH: Rect, level: LEVEL): boolean {
		// 无法容纳最大的箱子，继续寻找
		if (maxW.w + this.paddingTow > level.width || maxW.h + this.paddingTow > level.height ||
			maxH.w + this.paddingTow > level.width || maxH.h + this.paddingTow > level.height) {
			return false;
		}
		return true;
	}
}

// 初始化打包级别
const initLevel = (area: number) => {
	if (area > 4096 * 4096) {
		return
	}
	let w = 1, h = area / w, min = 1, max = 4096;
	while (w <= max && w <= h && h >= min) {
		if (h <= max) {
			PACK_LEVEL.push({ width: w, height: h, area: area, usage: 0.9 });
			if (w !== h) {
				PACK_LEVEL.push({ width: h, height: w, area: area, usage: 0.9 });
			}
		}
		w *= 2;
		h = area / w;
	}

	initLevel(area * 2);
}

//  打包级别
export const PACK_LEVEL: LEVEL[] = [];

/**
 * 对打包矩形按如下优先级进行排序
 * 1. 宽度向上取2的幂，从大到小排序
 * 2. 高度向上取2的幂，从大到小排序
 * 3. 宽度从大到小排序
 * 4. 高度从大到小排序
 * @param rects 
 */
const sortRect = (rects: Rect[], func: SortFunc) => {
	rects.sort(func);
}

const sortFuncDefault = (a: Rect, b: Rect) => {
	let awp = power2Up(a.w);
	let bwp = power2Up(b.w);
	if (awp < bwp) {
		return 1;
	} else if (awp === bwp) {
		let ahp = power2Up(a.h);
		let bhp = power2Up(b.h);
		if (ahp < bhp) {
			return 1;
		} else if (ahp === bhp) {
			if (a.w < b.w) {
				return 1;
			} else if (a.w === b.w) {
				if (a.h < b.h) {
					return 1;
				}
			}
		}
	}
	return -1;
}

export const calcBoxsUsage = (boxCollection: BoxCollection, startIndex = 0, endIndex?: number): number => {
	if (endIndex === undefined) {
		endIndex = boxCollection.boxs.length;
	}

	let useArea = 0, allArea = 0, box: ResultBoxWithUsage, boxs = boxCollection.boxs;
	for (; startIndex < endIndex; startIndex += 1) {
		box = boxs[startIndex];
		useArea += box.useArea;
		allArea += box.width * box.height;
		box.usage = box.useArea / (box.width * box.height);
	}
	boxCollection.useArea = useArea;

	if (allArea > 0) {
		return boxCollection.usage = useArea / allArea;
	} else {
		return boxCollection.usage = 0;
	}

}