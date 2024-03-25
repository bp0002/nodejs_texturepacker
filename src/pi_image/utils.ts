import { PNG } from 'pngjs';

/**
 * 判断一个数是不是2的幂
 * @param   num 参数
 */
export const isPower2 = (num: number) => {
    let tmp = Math.log2(num);

    return Number.isInteger(tmp);
};

/**
 * 获取比参数小的最大的值为2的幂的数
 * @param   num 参数
 */
export const power2Down = (num: number) => {
    let tmp = Math.log2(num);
    if (Number.isInteger(tmp)) {
        return num;
    }

    tmp = Math.floor(tmp);

    return Math.pow(2, tmp);
};

/**
 * 获取比参数大的最小的值为2的幂的数
 * @param   num 参数
 */
export const power2Up = (num: number) => {
    let tmp = Math.log2(num);
    if (Number.isInteger(tmp)) {
        return num;
    }

    tmp = Math.ceil(tmp);

    return Math.pow(2, tmp);
};

/**
 * 获取最接近参数的值为2的幂的数(大值优先)
 * @param   num 参数
 */
export const bestPower2 = (num: number) => {
    if (isPower2(num)) {
        return num;
    }
    const up = power2Up(num);
    const down = power2Down(num);

    if ((up - num) <= (num - down)) {
        return up;
    }
    return down;
};

/**
 * 判断png图片里是否含有alpha通道
 * @param   data    png图片的二进制数据
 */
export const pngContainAlpha = (data: Buffer | ArrayBuffer) => {
    const png = PNG.sync.read(Buffer.from(data));

    const len = png.data.byteLength;
    for (let i = 3; i <= len; i += 4) {
        if (png.data[i] !== 255) {
            return true;
        }
    }

    return false;
};

/**
 * 获取文件的后缀名
 * @param   path    文件所在路径
 */
export const getSuffix = (path: string) => {
    const idx = path.lastIndexOf(".");
    if (idx === -1) {
        return "";
    }
    return path.slice(idx + 1).toLowerCase();
};

