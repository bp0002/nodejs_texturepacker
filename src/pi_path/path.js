"use strict";
exports.__esModule = true;
exports.formatUrl = void 0;
function formatUrl(rootUrl, url) {
    if (url) {
        var rootList = rootUrl.split('/');
        var urlList = url.split('../');
        if (rootList.length < urlList.length) {
            return rootUrl + url;
        }
        else {
            var res = '';
            var rootListLen = rootList.length;
            var urlListLen = urlList.length;
            for (var i = 0; i < rootListLen - urlListLen; i++) {
                res += rootList[i] + "/";
            }
            res += urlList[urlListLen - 1];
            return res;
        }
    }
    else {
        return rootUrl + url;
    }
}
exports.formatUrl = formatUrl;
