import { Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage } from 'canvas';
import * as fs from "fs";
import { readJson } from "./read";

type ICellsConfig = [string];

function readCellsConfig(cfgPath: string): Promise<ICellsConfig> {
    return readJson(cfgPath) as Promise<ICellsConfig>;
}

type IRunListConfig = [string, string][];
function readRunListConfig(cfgPath: string): Promise<IRunListConfig> {
    return new Promise((resolve, reject) => {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const json: IRunListConfig = JSON.parse(data);
                resolve(json);
            }
        });
    });
}

interface IMergyConfig {
    asPNG: boolean;
    background: string;
    JPGBackgroundColor: [number, number, number];
    cellWidth: number;
    cellHeight: number;
    cellHCount: number;
    cellVCount: number;
    sourcePath: string;
    savepath: string;
    edge: number;
    flipY: boolean;
}

function readMergyConfig(cfgPath: string): Promise<IMergyConfig> {
    return new Promise((resolve, reject) => {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const json: IMergyConfig = JSON.parse(data);
                resolve(json);
            }
        });
    });
}

function mergy(mergyInfo: IMergyConfig, cells: ICellsConfig, cell: number, ctx: CanvasRenderingContext2D): Promise<null> {
    let h = cell % mergyInfo.cellHCount;
    let v = Math.floor(cell / mergyInfo.cellHCount);

    let srcpath = mergyInfo.sourcePath + "/" + cells[cell];

    return new Promise((resolve, reject) => {
        loadImage(srcpath).then((image) => {
            let ix = h * mergyInfo.cellWidth;
            let iy = v * mergyInfo.cellHeight;
            let iw = mergyInfo.cellWidth;
            let ih = mergyInfo.cellHeight;

            if (mergyInfo.flipY) {
                const canvas_temp = createCanvas(image.width, image.height);
                const ctx_temp = canvas_temp.getContext('2d', { alpha: true });
                ctx_temp.scale(1, -1);
                ctx_temp.translate(0, -image.height);
                ctx_temp.drawImage(image, 0, 0, image.width, image.height);

                ctx.drawImage(canvas_temp, ix + mergyInfo.edge, iy + mergyInfo.edge, iw - mergyInfo.edge * 2, ih - mergyInfo.edge * 2);
            } else {
                ctx.drawImage(image, ix + mergyInfo.edge, iy + mergyInfo.edge, iw - mergyInfo.edge * 2, ih - mergyInfo.edge * 2);
            }
            resolve(null);

        }).catch(reject);
    });
}

function mergys(mergyInfo: IMergyConfig, cells: ICellsConfig): Promise<Canvas> {
    let arr: Promise<null>[] = [];

    let canvasWidth = mergyInfo.cellWidth * mergyInfo.cellHCount;
    let canvasHeight = mergyInfo.cellHeight * mergyInfo.cellVCount;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d', { alpha: true });

    ctx.fillStyle = mergyInfo.background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // if (mergyInfo.flipY) {
    //     ctx.scale(1, -1);
    //     ctx.translate(0, -canvasHeight);
    // }

    cells.forEach((v, i) => {
        let promise = mergy(mergyInfo, cells, i, ctx);
        arr.push(promise);
    });

    return Promise.all(arr).then(() => {
        if (mergyInfo.asPNG == false) {
            let imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

            let r = mergyInfo.JPGBackgroundColor[0];
            let g = mergyInfo.JPGBackgroundColor[1];
            let b = mergyInfo.JPGBackgroundColor[2];

            let len = imgData.data.byteLength;

            for (let i = 0; i < len; i += 4) {

                if (imgData.data[i + 3] == 0) {
                    imgData.data[i + 0] = r;
                    imgData.data[i + 1] = g;
                    imgData.data[i + 2] = b;
                }

                imgData.data[i + 3] = 255;
            }

            ctx.putImageData(imgData, 0, 0);
        }

        return canvas;
    });
}

function save(mergyInfo: IMergyConfig, canvas: Canvas) {
    let savepath = mergyInfo.savepath + (mergyInfo.asPNG ? ".png" : ".jpg");
    const fs = require('fs');

    const out = fs.createWriteStream(savepath);

    if (mergyInfo.asPNG) {
        const stream = canvas.createPNGStream();
        stream.pipe(out);
    }
    else {
        const stream = canvas.createJPEGStream();
        stream.pipe(out);
    }

    out.on('finish', () =>  console.log(`'The ${mergyInfo.asPNG ? "PNG" : "JPEG"} file was created.'`));
}

// Promise.all([readCellsConfig("./cfg/tree_cell_id.json"), readMergyConfig("./cfg/tree_mergy.json")]).then(([cellinfo, mergyinfo]) => {
//     mergys(mergyinfo, cellinfo).then((canvas) => {
//         save(mergyinfo, canvas);
//     });
// }).then(() => {
//     Promise.all([readCellsConfig("./cfg/mine_cell_id.json"), readMergyConfig("./cfg/mine_mergy.json")]).then(([cellinfo, mergyinfo]) => {
//         mergys(mergyinfo, cellinfo).then((canvas) => {
//             save(mergyinfo, canvas);
//         });
//     })
// }).then(() => {
//     Promise.all([readCellsConfig("./cfg/bubble_cell_id.json"), readMergyConfig("./cfg/bubble_mergy.json")]).then(([cellinfo, mergyinfo]) => {
//         mergys(mergyinfo, cellinfo).then((canvas) => {
//             save(mergyinfo, canvas);
//         });
//     })
// });
// Promise.all([readCellsConfig("./cfg/number_cell_id.json"), readMergyConfig("./cfg/number_mergy.json")]).then(([cellinfo, mergyinfo]) => {
//     mergys(mergyinfo, cellinfo).then((canvas) => {
//         save(mergyinfo, canvas);
//     });
// })
// Promise.all([readCellsConfig("./cfg/mine_cell_id.json"), readMergyConfig("./cfg/mine_mergy.json")]).then(([cellinfo, mergyinfo]) => {
//     mergys(mergyinfo, cellinfo).then((canvas) => {
//         save(mergyinfo, canvas);
//     });
// });
// Promise.all([readCellsConfig("./cfg/map_cell_id.json"), readMergyConfig("./cfg/map_mergy.json")]).then(([cellinfo, mergyinfo]) => {
//     mergys(mergyinfo, cellinfo).then((canvas) => {
//         save(mergyinfo, canvas);
//     });
// })

const list: [string, string][] = [];

readRunListConfig("./runlist.json").then((json) => {
    json.forEach((item) => {
        list.push(item);
    });
    run();
});

function run() {
    if (list.length > 0) {
        let item = list.pop();
        if (item) {
            Promise.all([readCellsConfig(item[0]), readMergyConfig(item[1])]).then(([cellinfo, mergyinfo]) => {
                mergys(mergyinfo, cellinfo).then((canvas) => {
                    save(mergyinfo, canvas);
                });
            }).then(run);
        }
    }
}