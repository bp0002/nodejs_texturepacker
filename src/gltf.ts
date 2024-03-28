import { run } from "./gltf_collect";
import { IGLTFTaskConfig } from "./interface/gltf_task";
import { readJson } from "./read";

let configPath = process.argv[2];
let idx: number;
if (process.argv[3] != undefined) {
    idx = (<any>process.argv[3]) - 0;
}
if (configPath) {
    readJson(configPath).then((val: IGLTFTaskConfig[]) => {
        if (idx != undefined && !Number.isNaN(idx) && val.length > idx) {
            return run(configPath, [val[idx]]);
        } else {
            return run(configPath, val);
        }
    }).then(() => {
        console.log(`Tasks Finish!!`);
    });
}
