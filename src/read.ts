import * as fs from "fs";

export function readJson(cfgPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        console.error(">>> " + cfgPath);
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

export function readBin(cfgPath: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        fs.readFile(cfgPath, (err, data) => {
            if (err) {
                // console.error(err);
                reject(err);
            } else {
                resolve(new Uint8Array(data));
            }
        });
    });
}

export function readBinSync(cfgPath: string): Uint8Array {
    if (fs.existsSync(cfgPath)) {
        let data = fs.readFileSync(cfgPath);
        if (data) {
            return new Uint8Array(data)
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function sortNumberArray(a: ArrayLike<number>, b: ArrayLike<number>) {
    if (a.length != b.length) {
        return a.length - b.length;
    } else {
        let len = a.length;
        let result: number;
        for (let i = 0; i < len; i++) {
            result = a[i] - b[i];
            if (result != 0) {
                break;
            }
        }
        return result;
    }
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