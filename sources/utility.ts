import moment from "moment";
import fs from "fs";

export const localMoment = moment;
localMoment.locale("id");

export function readJSON(path: string) {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}
