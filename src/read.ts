import * as fs from "fs";

export function readJson(cfgPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(cfgPath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                // console.error(err);
                reject(err);
            } else {
                const json: any = JSON.parse(data);
                resolve(json);
            }
        });
    });
}

export function collectDirs(checkDirs: string[], dirList: [string, string][]) {
    if (checkDirs.length == 0) {
        return Promise.resolve(null);
    } else {
        let promises = [];
        let tempDir = [];
        checkDirs.forEach((dir) => {
            promises.push(
                new Promise<void>((resolve, reject) => {
                    fs.readdir(dir, (err, files) => {
                        if (err) {
                            console.error(`Read Dir Error: ${err}`);
                            resolve(null);
                        } else {
                            let list = [];
                            files.forEach((file) => {
                                let path = `${dir}${file}`;
                                list.push(
                                    new Promise<void>((resolve, reject) => {
                                        fs.stat(path, (err, stats) => {
                                            if (err) {
                                                console.error(`Read stat Error: ${err}`);
                                            } else {
                                                if (stats.isDirectory()) {
                                                    dirList.push([dir, file]);
                                                    tempDir.push(`${path}/`);
                                                }
                                            }
                                            resolve(null);
                                        })
                                    })
                                );
                            });

                            Promise.all(list).then(() => {
                                resolve(null);
                            }).catch(reject);
                        }
                    });
                })
            )
        });
        return Promise.all(promises);
    }
}

export function collectFiles(checkDirs: string[], dirList: [string, string][], fileList: [string, string][]) {
    if (checkDirs.length == 0) {
        return Promise.resolve(null);
    } else {
        let promises = [];
        let tempDir = [];
        checkDirs.forEach((dir) => {
            promises.push(
                new Promise<void>((resolve, reject) => {
                    fs.readdir(dir, (err, files) => {
                        if (err) {
                            console.error(`Read Dir Error: ${err}`);
                            resolve(null);
                        } else {
                            let list = [];
                            files.forEach((file) => {
                                let path = `${dir}${file}`;
                                list.push(
                                    new Promise<void>((resolve, reject) => {
                                        fs.stat(path, (err, stats) => {
                                            if (err) {
                                                console.error(`Read stat Error: ${err}`);
                                            } else {
                                                if (stats.isDirectory()) {
                                                    dirList.push([dir, file]);
                                                    tempDir.push(`${path}/`);
                                                } else {
                                                    fileList.push([dir, file]);
                                                }
                                            }
                                            resolve(null);
                                        })
                                    })
                                );
                            });

                            Promise.all(list).then(() => {
                                resolve(null);
                            }).catch(reject);
                        }
                    });
                })
            )
        });
        return Promise.all(promises).then(() => {
            // console.log(tempDir);
            return collectFiles(tempDir, dirList, fileList);
        });
    }
}