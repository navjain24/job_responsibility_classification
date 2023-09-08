import fs from 'fs';
import { makeDirIfNeeded, SILVER_DATA, createHash } from './common.js';

//wink-nlp
import winkNlp from 'wink-nlp';

// Load english language model — light version.
import model from 'wink-eng-lite-web-model';

// Instantiate winkNLP.
const nlp = winkNlp(model);

export async function extractSentences(rootFolder) {
    const dirs = fs.readdirSync(rootFolder)

    //process all files using forEach
    dirs.forEach(function (dirName) {
        console.log(`Found directory: ${dirName}`);
        const sourceFileFolder = `${rootFolder}/${dirName}`;
        const files = fs.readdirSync(sourceFileFolder)

        let jobRole = dirName;
        //process all files using forEach
        files.forEach(function (fileName) {
            console.log(`Found file: ${fileName}`);
            if (fileName.endsWith(".txt")) {
                const sourceFullFilePath = `${sourceFileFolder}/${fileName}`;
                extractSentencesFromSingleJob(jobRole, sourceFullFilePath);
            }
        });
    });
}

function extractSentencesFromSingleJob(jobRole, sourceFullFilePath) {
    console.log(`Processing file: ${sourceFullFilePath}`);

    //Read job description text
    const pageDataText = fs.readFileSync(sourceFullFilePath, 'utf8');

    // Load into nlp
    const doc = nlp.readDoc(pageDataText);

    // Extract sentences from the data
    const sentences = doc.sentences().out();

    // Create a new file for each sentence and store the same
    // The content hash of the text is the file name.
    const destinationRootFolder = SILVER_DATA
    makeDirIfNeeded(destinationRootFolder);

    const destinationFolder = `${destinationRootFolder}/${jobRole}`;
    makeDirIfNeeded(destinationFolder);

    sentences.forEach((sentence) => {
        let contentHash = createHash(sentence);
        let fileName = `${contentHash}.sentence`;
        const destinationFilePath = `${destinationFolder}/${fileName}`;

        fs.writeFileSync(destinationFilePath, sentence);
        console.log(`Extracted a sentence from: ${sourceFullFilePath} to file: ${destinationFilePath}\n`);
    });
}


/*
export function extractSentences(rootFolder) {
    // Read text
    const doc = nlp.readDoc(text);

    // Extract sentences from the data
    const sentences = doc.sentences().out();

    return sentences;
}
*/

export function breakIntoSentences(text) {
    // Read text
    const doc = nlp.readDoc(text);

    // Extract sentences from the data
    const sentences = doc.sentences().out();

    return sentences;
}