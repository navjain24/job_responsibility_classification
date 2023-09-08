import fs from 'fs';

export const BRONZE_DATA = 'BRONZE_DATA';
export const SILVER_DATA = 'SILVER_DATA';
export const GOLD_DATA = 'GOLD_DATA';


export function makeDirIfNeeded(dirName) {
    try {
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
    } catch (err) {
        console.error(err);
        throw err
    }
}
