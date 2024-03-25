import * as fs from "fs";

const savepath = "./cfg/";
function colllect(dirPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                console.log('获取文件文件夹信息失败');
                reject('获取文件文件夹信息失败');
            }

            let str = '[\r\n';
            let len = files.length;
            for (let i = 0; i < len; i++) {
                str += `"${files[i]}"`;

                if (i < len - 1) {
                    str += ',';
                }

                str += '\r\n';
            }
            str += ']';

            fs.writeFile(`${savepath}files.json`, str, { encoding: "utf-8" }, () => {
                console.log('保存成功');
            });

            resolve(undefined);
        });
    });
}

colllect("./images/");
