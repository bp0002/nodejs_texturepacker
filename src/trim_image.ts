const getPixels = require("get-pixels");


export function trimImage(filename: string, cb: (err: string, data: [Uint8Array, { top: number; right: number; bottom: number; left: number }, number, number]) => void, log: boolean, alphaTrim: number = 0, transparencyFromGray: boolean = false) {

    let crop = {
        top: true,
        right: true,
        bottom: true,
        left: true,
    };

    getPixels(filename, (err, pixels) => {
        if (err) {
            cb('Bad image path:', null);
            return;
        }

        const w = pixels.shape[0];
        const h = pixels.shape[1];

        let i, j, a, r, g, b;

        let cropData = {
            top: 0,
            right: w,
            bottom: h,
            left: 0,
        };

        top:
        if (crop.top) {
            for (j = 0; j < h; j++) {
                cropData.top = j;

                for (i = 0; i < w; i++) {
                    a = pixels.get(i, j, 3);
                    r = pixels.get(i, j, 0);
                    g = pixels.get(i, j, 1);
                    b = pixels.get(i, j, 2);
                    if (transparencyFromGray) {
                        if ((r + g + b) > alphaTrim) break top;
                    } else {
                        if (a > alphaTrim) break top;
                    }
                }
            }
        }

        left:
        if (crop.left) {
            for (i = 0; i < w; i++) {
                cropData.left = i;

                for (j = 0; j < h; j++) {
                    a = pixels.get(i, j, 3);
                    r = pixels.get(i, j, 0);
                    g = pixels.get(i, j, 1);
                    b = pixels.get(i, j, 2);

                    if (transparencyFromGray) {
                        if ((r + g + b) > alphaTrim) break left;
                    } else {
                        if (a > alphaTrim) break left;
                    }
                }
            }
        }

        right:
        if (crop.right) {
            for (i = w - 1; i >= 0; i--) {
                for (j = h - 1; j >= 0; j--) {
                    a = pixels.get(i, j, 3);
                    r = pixels.get(i, j, 0);
                    g = pixels.get(i, j, 1);
                    b = pixels.get(i, j, 2);

                    if (transparencyFromGray) {
                        if ((r + g + b) > alphaTrim) break right;
                    } else {
                        if (a > alphaTrim) break right;
                    }
                }

                cropData.right = i;
            }
        }

        bottom:
        if (crop.bottom) {
            for (j = h - 1; j >= 0; j--) {
                for (i = w - 1; i >= 0; i--) {
                    a = pixels.get(i, j, 3);
                    r = pixels.get(i, j, 0);
                    g = pixels.get(i, j, 1);
                    b = pixels.get(i, j, 2);

                    if (transparencyFromGray) {
                        if ((r + g + b) > alphaTrim) break bottom;
                    } else {
                        if (a > alphaTrim) break bottom;
                    }
                }

                cropData.bottom = j;
            }
        }

        // Check error
        if ((cropData.left > cropData.right) || (cropData.top > cropData.bottom)) {
            // cb('Crop coordinates overflow:', null);
            cropData.left = 1;
            cropData.right = 2;
            cropData.top = 1;
            cropData.bottom = 2;
            cb(null, [new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]), cropData, w, h]);
        } else {
            if (log) {
                console.log(`Trim: ${filename} right ${cropData.right} bottom ${cropData.bottom} left ${cropData.left} top ${cropData.top}`);
            }
            let data = pixels.hi(cropData.right, cropData.bottom).lo(cropData.left, cropData.top);
            cb(null, [data.data, cropData, w, h])
        }
    });
};