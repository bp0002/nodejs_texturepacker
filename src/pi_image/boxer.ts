import { Rect, RectSpace, Result, ResultBox, ResultRect } from "./interface";
/**
 * 二维装箱
 * 该算法适用于将x个矩形尽力装入一个指定宽高的箱子，返回装好的箱子和剩余的矩形
 * 为了打包结果的利用率更高，外部需要经打包矩形从大到小排序
 */

export class Boxer {
    padding: number;
    private paddingTow: number;

    constructor(padding = 0) {
        this.padding = padding;
        this.paddingTow = this.padding * 2;
    }

    /**
     * 给定盒子宽高，新建对应箱子，将打包矩形尽量装入该箱子
     * 装箱结束后返回箱子及剩余未打包矩形
     */
    packBox = (rects: Rect[], boxWidth: number, boxHeight: number): Result => {
        let retBox: ResultBox = {
            useArea: 0, rects: [], level: 0, width: boxWidth, height: boxHeight, spaceList: [{
                x: 0,
                y: 0,
                w: boxWidth,
                h: boxHeight,
                level: [{ x: 0, w: boxWidth }],
            }]
        };
        let spaceList: RectSpace[] = retBox.spaceList;
        let remainRects = [];

        for (let i = 0; i < rects.length; i++) {
            // boxs.length === 0是，箱子已经装满了
            if (spaceList.length === 0) {
                remainRects = remainRects.concat(rects.slice(i, rects.length));
                break;
            }
            // 箱子未装满，选择一个矩形空间装入矩形， 并重新调整子矩形空间布局
            const rect = rects[i];
            let isRemain = true;
            for (let j = 0; j < spaceList.length; ++j) {
                let it = spaceList[j];
                let r = this.isContains(it, rect);
                if (r) {
                    let ret = {
                        index: rect.index,
                        w: rect.w,
                        h: rect.h,
                        x: it.x,
                        y: it.y,
                        area: rect.area,
                        sign: rect.sign
                    };
                    //  添加到收纳箱
                    retBox.rects.push(ret);
                    retBox.useArea += ret.area;
                    spaceList = sortoutBoxs(spaceList, ret, this.padding);// 对箱子从小到大进行排序
                    isRemain = false;
                    break;
                }
            }
            if (isRemain) {
                remainRects.push(rect);
            }
        }

        return { remainRects: remainRects, ret: retBox };
    }

    // 判断打包箱子是否能容纳某个矩形
    isContains = (box: RectSpace, rect: Rect): boolean => {
        return box.w >= rect.w + this.paddingTow && box.h >= rect.h + this.paddingTow;
    }
}

/**
 * 辅助调试，后面会删除
 */
const addBox = (boxs: RectSpace[], box: RectSpace) => {
    if (box.x < 0 || box.y < 0 || box.w <= 0, box.h <= 0) {
        console.log("xxxxxxxxxxxxxxxxxxx");
    }
    for (let i = 0; i < box.level.length; i++) {
        if (box.level[i].x < 0 || box.level[i].w <= 0) {
            console.log("yyyyyyyyyyyyyy");
        }
    }
    // if(box.x===1837 && box.h > 80) {
    // 	// console.log("zzzzzzzzzzzzzz");
    // }
    boxs.push(box);

}

/**
 * 根据在箱子中放入矩形，重新规划箱子数量及尺寸
 * @param boxs 目前的箱子集合
 * @param resultRect 放入的矩形
 * @param padding 放入是的边距
 */
const sortoutBoxs = (boxs: RectSpace[], resultRect: ResultRect, padding: number): RectSpace[] => {
    let [top, right, bottom, left] = [resultRect.y, padding * 2 + resultRect.x + resultRect.w, padding * 2 + resultRect.y + resultRect.h, resultRect.x];
    let newBox = [];
    let mergeLevelIndex = -1;;
    for (let j = 0; j < boxs.length; j++) {
        let box = boxs[j];
        let [btop, bright, bbottom, bleft] = [box.y, box.x + box.w, box.y + box.h, box.x];
        // 合并水平线
        if (btop === bottom && (right <= bright && left >= bleft)) {
            let index = box.level.length; let i = 0;
            for (; i < box.level.length; i++) {
                let level = box.level[i];
                if (left === level.x + level.w) {
                    level.w += right - left;
                    index = -1;

                    // 尝试连接后面的水平线
                    let level1 = box.level[i + 1];
                    if (level1 && level1.x === level.w + level.x) {
                        level.w += level1.w;
                        box.level.splice(i + 1, 1);
                    }
                    break;
                } else if (right === level.x) {
                    level.x = left;
                    level.w += right - left;
                    index = -1;

                    // 尝试连接前面的水平线
                    let level1 = box.level[i - 1];
                    if (level1 && level.x === level1.w + level1.x) {
                        level1.w += level.w;
                        box.level.splice(i, 1);
                    }
                    break;
                } else if (level.x > right) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                box.level.splice(index, 0, { x: left, w: right - left });
            }
            mergeLevelIndex = j;
            break;
        }
    }

    let newLevelBoxs = [];
    let newLevelBox = {
        x: Number.MAX_VALUE,
        y: bottom,
        w: 0,
        h: 0,
        level: [{ x: left, w: right - left }], // 指水平轮廓线的起点
    }, isNewLevelBox = false;
    for (let j = 0; j < boxs.length; j++) {
        let box = boxs[j];
        let [btop, bright, bbottom, bleft] = [box.y, box.x + box.w, box.y + box.h, box.x];
        if (j == mergeLevelIndex) {
            addBox(newBox, box);
            continue;
        }

        // 完全不相交
        if (bottom <= btop || bright <= left || right <= bleft || bbottom <= top) {
            addBox(newBox, box);
            continue;
        }

        // 与容器相交端点
        let [lcleft, lcright] = [Math.max(left, bleft), Math.min(right, bright)];
        if (box.y <= top) { // 容器最低水平线低于矩形最低水平线，则新增空洞, (矩形只会在左侧)
            let endi = -1, i = 0;
            for (; i < box.level.length; i++) {
                let level = box.level[i];
                if (level.x + level.w >= lcright && level.x < lcright) { // 相交终点
                    endi = i;
                    break;
                }
            }
            if (box.y < top) {
                if (i === box.level.length && endi === -1) { // 全部相交
                    addBox(newBox, {
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: top - box.y,
                        level: box.level, // 指水平轮廓线的起点
                    });
                } else if (i < box.level.length && endi !== -1) { // 部分相交
                    let level = box.level[endi];
                    let b1 = {
                        x: box.x,
                        y: box.y,
                        w: lcright - box.x,
                        h: top - box.y,
                        level: box.level.slice(0, endi), // 指水平轮廓线的起点
                    };
                    b1.level.push({ x: level.x, w: lcright - level.x });
                    addBox(newBox, b1);
                }
            } else {//box.y == top
                if (mergeLevelIndex === -1 && bbottom - bottom > 0) {
                    let old = findSim(bbottom - bottom, newLevelBoxs);
                    if (!old) {
                        let new_box = {
                            x: bleft,
                            y: bottom,
                            w: bright - bleft,
                            h: bbottom - bottom,
                            level: [{ x: left, w: right - left }], // 指水平轮廓线的起点
                        }
                        addBox(newBox, new_box);
                        newLevelBoxs.push(new_box);
                    } else {
                        old.x = Math.min(newLevelBox.x, bleft);
                        // newLevelBox.y = Math.min(newLevelBox.y, bottom);
                        // newLevelBox.w = Math.max(newLevelBox.w, bright - newLevelBox.x);
                        // newLevelBox.h = Math.max(newLevelBox.h, bbottom - newLevelBox.y);
                        old.w = Math.max(bright, old.x + old.w) - old.x;
                    }
                }
            }

            if (i < box.level.length && endi === -1) { // 全部不相交
                addBox(newBox, {
                    x: lcright,
                    y: box.y,
                    w: bright - lcright,
                    h: box.h,
                    level: box.level, // 指水平轮廓线的起点
                });
            } else if (i < box.level.length && endi !== -1) {
                let level = box.level[endi];
                let ww = level.x + level.w - lcright;
                let l2 = ww === 0 ? [] : [{ x: lcright, w: ww }];
                let b2 = {
                    x: lcright,
                    y: box.y,
                    w: bright - lcright,
                    h: box.h,
                    level: l2.concat(box.level.slice(endi + 1, box.level.length)), // 指水平轮廓线的起点
                };
                addBox(newBox, b2);
            }
        } else {
            let i = 0;
            for (; i < box.level.length; i++) {
                let level = box.level[i];
                if (level.x >= lcleft) { // 相交终点
                    break;
                }
            }
            let leftLevel = box.level.slice(0, i);
            let rightLevel = box.level.slice(i, box.level.length);
            if (leftLevel.length !== 0) {
                addBox(newBox, {
                    x: box.x,
                    y: box.y,
                    w: lcleft - box.x,
                    h: box.h,
                    level: leftLevel, // 指水平轮廓线的起点
                });
            }
            if (rightLevel.length !== 0 && bright - lcright > 0) {
                addBox(newBox, {
                    x: lcright,
                    y: box.y,
                    w: bright - lcright,
                    h: box.h,
                    level: rightLevel, // 指水平轮廓线的起点
                });
            }

            if (mergeLevelIndex === -1 && bbottom - bottom > 0) {
                let old = findSim(bbottom - bottom, newLevelBoxs);
                if (!old) {
                    let new_box = {
                        x: bleft,
                        y: bottom,
                        w: box.w,
                        h: bbottom - bottom,
                        level: [{ x: left, w: right - left }], // 指水平轮廓线的起点
                    }
                    addBox(newBox, new_box);
                    newLevelBoxs.push(new_box);
                } else {
                    old.x = Math.min(newLevelBox.x, bleft);
                    // newLevelBox.y = Math.min(newLevelBox.y, bottom);
                    // newLevelBox.w = Math.max(newLevelBox.w, bright - newLevelBox.x);
                    // newLevelBox.h = Math.max(newLevelBox.h, bbottom - newLevelBox.y);
                    old.w = Math.max(bright, old.x + old.w) - old.x;
                }
            }
        }
    }

    // if(isNewLevelBox) {
    //     addBox(newBox, newLevelBox);
    // }
    // 排序，
    return newBox.sort((a, b) => {
        return a.y - b.y;
    });
}

const findSim = (h: number, list: RectSpace[]) => {
    for (let b of list) {
        if (b.h === h) {
            return b;
        }
    }
}
