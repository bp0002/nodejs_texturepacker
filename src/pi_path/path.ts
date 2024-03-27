
import * as fs from "fs";

export function formatUrl(rootUrl: string, url: string | undefined) {
    if (url) {
        const rootList = rootUrl.split('/');
        const urlList = url.split('../');
        if (rootList.length < urlList.length) {
            return rootUrl + url;
        } else {
            let res = '';
            const rootListLen = rootList.length;
            const urlListLen = urlList.length;
            for (let i = 0; i < rootListLen - urlListLen; i++) {
                res += `${rootList[i]}/`;
            }
            res += urlList[urlListLen - 1];

            return res;
        }
    } else {
        return rootUrl + url;
    }
}

export function makeDir(path: string) {
    let match = path.match(/(.*\/)/);
    if (match) {
        let list = match[0].split("\/");
        let dir = "";
        list.forEach((item) => {
            if (item != "") {
                dir += item + "\/";
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
            }
        });
    }
}