import { ITexturePackAtlas, ITexturePackAtlasCompact, ITexturePackFrameCompact } from "./interface/texturepacker";
import { optAtlas } from "./optimize";
import { readJson } from "./read";
import * as fs from "fs";

function run(tasks: [string, string, boolean][], errors: any[]) {
    let task = tasks.pop();
    if (task == undefined) {
        return Promise.resolve(null);
    } else {
        return optAtlas(task[0], task[1], task[2]).then(() => {
            return run(tasks, errors);
        })
    }
}

let configPath = process.argv[2];
let idx: number;
if (process.argv[3] != undefined) {
    idx = (<any>process.argv[3]) - 0;
}
if (configPath) {
    let errors = [];
    readJson(configPath).then((val: [string, string, boolean][]) => {
        if (idx != undefined && !Number.isNaN(idx) && val.length > idx) {
            return run([val[idx]], errors);
        } else {
            return run(val, errors);
        }
    }).then(() => {
        console.log(`Tasks Finish!!`);
        errors.forEach((err) => {
            console.error(err);
        })
    });
}