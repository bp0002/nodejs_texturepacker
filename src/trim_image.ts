const getPixels = require("get-pixels");


export function trimImage(filename: string, cb: (err: string, data: [Uint8Array, { top: number; right: number; bottom: number; left: number }, number, number]) => void, log: boolean) {

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

        let i, j, a;

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

                    if (a !== 0) break top;
                }
            }
        }

        right:
        if (crop.right) {
            for (i = w - 1; i >= 0; i--) {
                for (j = h - 1; j >= 0; j--) {
                    a = pixels.get(i, j, 3);

                    if (a !== 0) break right;
                }

                cropData.right = i;
            }
        }

        bottom:
        if (crop.bottom) {
            for (j = h - 1; j >= 0; j--) {
                for (i = w - 1; i >= 0; i--) {
                    a = pixels.get(i, j, 3);

                    if (a !== 0) break bottom;
                }

                cropData.bottom = j;
            }
        }

        left:
        if (crop.left) {
            for (i = 0; i < w; i++) {
                cropData.left = i;

                for (j = 0; j < h; j++) {
                    a = pixels.get(i, j, 3);

                    if (a !== 0) break left;
                }
            }
        }

        // Check error
        if ((cropData.left > cropData.right) || (cropData.top > cropData.bottom)) {
            cb('Crop coordinates overflow:', null);
        } else {
            if (log) {
                console.log(`Trim: ${filename} right ${cropData.right} bottom ${cropData.bottom} left ${cropData.left} top ${cropData.top}`);
            }
            let data = pixels.hi(cropData.right, cropData.bottom).lo(cropData.left, cropData.top);
            cb(null, [data.data, cropData, w, h])
        }
    });
};