import fs from 'fs';
import * as crypto from 'crypto'

export const RAW_JOB_DATA = 'RAW_JOB_DATA';
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

export function createHash(text) {
    var hash = crypto.createHash('md5').update(text).digest('hex');
    return hash;
}