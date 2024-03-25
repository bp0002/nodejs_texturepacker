"use strict";
exports.__esModule = true;
var canvas_1 = require("canvas");
var fs = require("fs");
function readCellsConfig(cfgPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                var json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}
function readRunListConfig(cfgPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                var json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}
function readMergyConfig(cfgPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                var json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}
function mergy(mergyInfo, cells, cell, ctx) {
    var h = cell % mergyInfo.cellHCount;
    var v = Math.floor(cell / mergyInfo.cellHCount);
    var srcpath = mergyInfo.sourcePath + "/" + cells[cell];
    return new Promise(function (resolve, reject) {
        canvas_1.loadImage(srcpath).then(function (image) {
            var ix = h * mergyInfo.cellWidth;
            var iy = v * mergyInfo.cellHeight;
            var iw = mergyInfo.cellWidth;
            var ih = mergyInfo.cellHeight;
            if (mergyInfo.flipY) {
                var canvas_temp = canvas_1.createCanvas(image.width, image.height);
                var ctx_temp = canvas_temp.getContext('2d', { alpha: true });
                ctx_temp.scale(1, -1);
                ctx_temp.translate(0, -image.height);
                ctx_temp.drawImage(image, 0, 0, image.width, image.height);
                ctx.drawImage(canvas_temp, ix + mergyInfo.edge, iy + mergyInfo.edge, iw - mergyInfo.edge * 2, ih - mergyInfo.edge * 2);
            }
            else {
                ctx.drawImage(image, ix + mergyInfo.edge, iy + mergyInfo.edge, iw - mergyInfo.edge * 2, ih - mergyInfo.edge * 2);
            }
            resolve(null);
        })["catch"](reject);
    });
}
function mergys(mergyInfo, cells) {
    var arr = [];
    var canvasWidth = mergyInfo.cellWidth * mergyInfo.cellHCount;
    var canvasHeight = mergyInfo.cellHeight * mergyInfo.cellVCount;
    var canvas = canvas_1.createCanvas(canvasWidth, canvasHeight);
    var ctx = canvas.getContext('2d', { alpha: true });
    ctx.fillStyle = mergyInfo.background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // if (mergyInfo.flipY) {
    //     ctx.scale(1, -1);
    //     ctx.translate(0, -canvasHeight);
    // }
    cells.forEach(function (v, i) {
        var promise = mergy(mergyInfo, cells, i, ctx);
        arr.push(promise);
    });
    return Promise.all(arr).then(function () {
        if (mergyInfo.asPNG == false) {
            var imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            var r = mergyInfo.JPGBackgroundColor[0];
            var g = mergyInfo.JPGBackgroundColor[1];
            var b = mergyInfo.JPGBackgroundColor[2];
            var len = imgData.data.byteLength;
            for (var i = 0; i < len; i += 4) {
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
function save(mergyInfo, canvas) {
    var savepath = mergyInfo.savepath + (mergyInfo.asPNG ? ".png" : ".jpg");
    var fs = require('fs');
    var out = fs.createWriteStream(savepath);
    if (mergyInfo.asPNG) {
        var stream = canvas.createPNGStream();
        stream.pipe(out);
    }
    else {
        var stream = canvas.createJPEGStream();
        stream.pipe(out);
    }
    out.on('finish', function () { return console.log("'The " + (mergyInfo.asPNG ? "PNG" : "JPEG") + " file was created.'"); });
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
var list = [];
readRunListConfig("./runlist.json").then(function (json) {
    json.forEach(function (item) {
        list.push(item);
    });
    run();
});
function run() {
    if (list.length > 0) {
        var item = list.pop();
        if (item) {
            Promise.all([readCellsConfig(item[0]), readMergyConfig(item[1])]).then(function (_a) {
                var cellinfo = _a[0], mergyinfo = _a[1];
                mergys(mergyinfo, cellinfo).then(function (canvas) {
                    save(mergyinfo, canvas);
                });
            }).then(run);
        }
    }
}
