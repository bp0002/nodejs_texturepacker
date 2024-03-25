import { power2Down, power2Up } from "./utils";
import * as images from "images";
import * as nodePath from 'path';
import { Args, ImgInfo, ImgItem, ImgMapCfg, Rect, ResultBox, ResultBoxWithUsage } from "./interface";
import { PACK_LEVEL, Packer } from "./pack";

/**
 * 面积利用率最高的装箱
 * @param blocks    矩形块数组
 * @param width     箱子宽
 * @param height    箱子高
 * @param method    使用该指定的排序方法装箱排序
 */
const bestLayout = (blocks: ImgItem[], padding: number, sizeLimit: number): { boxs: ResultBoxWithUsage[], unsuited: ImgItem[] } => {
	let packer = new Packer(padding, sizeLimit);
	let items: Rect[] = [];
	let unsuited: ImgItem[] = [];
	let padding2 = padding * 2;

	for (let i = 0; i < blocks.length; i++) {
		const b = blocks[i];
		// 宽高超出限制，单独提取, 并且不会将其算成2的幂次宽高，这类图片不符合我们的规范，建议修正
		// ImgItem中， notMerge为true，则不对其进行装箱
		if (b.notMerge || padding2 + b.w > 4096 || padding2 + b.h > 4096) {
			unsuited.push(b);
		} else {
			items.push({
				index: i,
				w: blocks[i].w,
				h: blocks[i].h,
			})
		}
	}

	const boxs = packer.pack(items).boxs;
	// 如果打包后的箱子中，只包含一个矩形，则将其提取出来，并重置宽高
	// 此断代码用于优化， 比如，一张512*512的图片被单独打包时，由于设置了padding，则打包后的图片必然为1024 * 1024，极大的浪费了空间
	// 通常，一张图片不与其它图片合并在一起时，设置padding是没有意义的，因此将其单独提取出来，并重置宽高
	if (padding > 0) {
		for (let i = 0; i < boxs.length; i++) {
			const box = boxs[i];
			if (box.rects.length === 1) {
				const b = box.rects[0];
				const bb = PACK_LEVEL[box.level];
				const downWidth = power2Down(bb.width - 1);
				const downHeight = power2Down(bb.height - 1);
				if (b.w <= downWidth && b.h <= downHeight) {
					unsuited.push(blocks[b.index]);
					boxs.splice(i, 1);
					i--;
				}
			}
		}
	}
	return { boxs, unsuited };
};

// 绘制合并图片
const drawCombineImages = (
	rets: { boxs: ResultBoxWithUsage[], unsuited: ImgItem[] },
	list: ImgItem[],
	imgMapCfg: ImgMapCfg,
	img_buffers: Buffer[],
	imgs: images.Image[],
	type: string,
	zoomSuf: string,
	args: Args
) => {
	if (list.length === 0) {
		return;
	}

	for (let ret of rets.boxs) {
		let w = ret.width;
		let h = ret.height;
		const targetImage = images(w, h);
		let path;
		ret.rects.forEach((item) => {
			let imgItem = list[item.index];
			path = imgItem.dir;
			drawImg(targetImage, item.x - 1, item.y - 1, imgItem.img, true, true);
			setUv(imgMapCfg, imgItem, item.x, item.y);
		});

		img_buffers.push(targetImage.encode(type as any) as any);
		imgs.push(targetImage);
		imgMapCfg.groups.push({
			w: w,
			h: h,
			path: `${path}_${imgMapCfg.groups.length}${zoomSuf}.${type}`,
		});
	}

	// 处理单张图片
	for (let imgItem of rets.unsuited) {
		let w = power2Up(imgItem.w);
		let h = power2Up(imgItem.h);
		let targetImage = imgItem.img;
		if (w !== imgItem.w || h !== imgItem.h) {
			targetImage = images(w, h);
			drawImg(targetImage, 0, 0, imgItem.img, false, true);
		}
		setUv(imgMapCfg, imgItem, 0, 0);
		img_buffers.push(targetImage.encode(type as any) as any);
		imgs.push(targetImage);
		imgMapCfg.groups.push({
			w: w,
			h: h,
			path: `${imgItem.dir}_${imgMapCfg.groups.length}${zoomSuf}.${type}`,
		});
	}

};

const setUv = (imgMapCfg: ImgMapCfg, imgItem: ImgItem, x: number, y: number) => {
	if (!imgMapCfg.imgs[imgItem.name]) {
		imgMapCfg.imgs[imgItem.name] = {} as any
	}
	let srcDecs = imgMapCfg.imgs[imgItem.name] as ImgInfo;
	srcDecs.left = x;
	srcDecs.top = y;
	srcDecs.w = imgItem.w;
	srcDecs.h = imgItem.h;
	srcDecs.groupI = imgMapCfg.groups.length;
}

/**
 * 扩展图片， 将图片的边缘
 */
const drawImg = (dstimg: images.Image, x: number, y: number, srcImg: images.Image, isExtendStart: boolean, isExtendEnd: boolean) => {
	let w = dstimg.width(), h = dstimg.height();
	let remainW = w - x, remainH = h - y;
	let srcW = srcImg.width(), srcH = srcImg.height();

	if (isExtendStart) {
		if (remainW > srcW) {
			x += 1;
			remainW -= 1;
		}
		if (remainH > srcH) {
			y += 1;
			remainH -= 1;
		}
	}
	// console.log(`dstimg1: ${dstimg.width() }, ${dstimg.height()}, src:${srcImg.width()}, ${srcImg.height()}, x: ${x}, y: ${y}`, isExtendStart);
	dstimg.copyFromImage2(srcImg, x, y);
	// dstimg.draw(srcImg, x, y);

	if (isExtendStart) {
		if (remainW > srcW && x > 1) {
			x -= 1;
			let left = images(dstimg, x + 1, y, 1, srcH);
			// dstimg.draw(left, x, y);
			// console.log(`dstimg2: ${dstimg.width() }, ${dstimg.height()}, src:${left.width()}, ${left.height()}, x: ${x}, y: ${y}`);
			dstimg.copyFromImage2(left, x, y);
			srcW += 1;
		}
		if (remainH > srcH && y > 1) {
			y -= 1;
			let top = images(dstimg, x, y + 1, srcW, 1);
			// dstimg.draw(top, x, y);
			// console.log(`dstimg3: ${dstimg.width() }, ${dstimg.height()}, src:${top.width()}, ${top.height()}, x: ${x}, y: ${y}`);
			dstimg.copyFromImage2(top, x, y);
			srcH += 1;
		}
	}

	remainW -= srcW;
	remainH -= srcH;

	if (isExtendEnd) {
		if (remainW > 0) {
			x += srcW;
			let right = images(dstimg, x - 1, y, 1, srcH);
			// dstimg.draw(right, x, y);
			// console.log(`dstimg4: ${dstimg.width() }, ${dstimg.height()}, src:${right.width()}, ${right.height()}, x: ${x}, y: ${y}`);
			dstimg.copyFromImage2(right, x, y);
			x -= srcW;
			srcW += 1;
		}
		if (remainH > 0) {
			y += srcH;
			let bottom = images(dstimg, x, y - 1, srcW, 1);
			// dstimg.draw(bottom, x, y);
			// console.log(`dstimg5: ${dstimg.width() }, ${dstimg.height()}, src:${bottom.width()}, ${bottom.height()}, x: ${x}, y: ${y}`);
			dstimg.copyFromImage2(bottom, x, y);
		}
	}
	return dstimg;
}