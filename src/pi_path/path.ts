
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