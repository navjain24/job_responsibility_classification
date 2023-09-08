import fs from 'fs';

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
