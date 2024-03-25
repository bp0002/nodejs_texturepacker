"use strict";
exports.__esModule = true;
exports.trimImage = void 0;
var getPixels = require("get-pixels");
function trimImage(filename, cb, log) {
    var crop = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };
    getPixels(filename, function (err, pixels) {
        if (err) {
            cb('Bad image path:', null);
            return;
        }
        var w = pixels.shape[0];
        var h = pixels.shape[1];
        var i, j, a;
        var cropData = {
            top: 0,
            right: w,
            bottom: h,
            left: 0
        };
        top: if (crop.top) {
            for (j = 0; j < h; j++) {
                cropData.top = j;
                for (i = 0; i < w; i++) {
                    a = pixels.get(i, j, 3);
                    if (a !== 0)
                        break top;
                }
            }
        }
        right: if (crop.right) {
            for (i = w - 1; i >= 0; i--) {
                for (j = h - 1; j >= 0; j--) {
                    a = pixels.get(i, j, 3);
                    if (a !== 0)
                        break right;
                }
                cropData.right = i;
            }
        }
        bottom: if (crop.bottom) {
            for (j = h - 1; j >= 0; j--) {
                for (i = w - 1; i >= 0; i--) {
                    a = pixels.get(i, j, 3);
                    if (a !== 0)
                        break bottom;
                }
                cropData.bottom = j;
            }
        }
        left: if (crop.left) {
            for (i = 0; i < w; i++) {
                cropData.left = i;
                for (j = 0; j < h; j++) {
                    a = pixels.get(i, j, 3);
                    if (a !== 0)
                        break left;
                }
            }
        }
        // Check error
        if ((cropData.left > cropData.right) || (cropData.top > cropData.bottom)) {
            cb('Crop coordinates overflow:', null);
        }
        else {
            if (log) {
                console.log("Trim: " + filename + " right " + cropData.right + " bottom " + cropData.bottom + " left " + cropData.left + " top " + cropData.top);
            }
            var data = pixels.hi(cropData.right, cropData.bottom).lo(cropData.left, cropData.top);
            cb(null, [data.data, cropData, w, h]);
        }
    });
}
exports.trimImage = trimImage;
;
