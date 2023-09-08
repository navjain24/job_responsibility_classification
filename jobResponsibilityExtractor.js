import cheerio from 'cheerio';
import fs from 'fs';
import { makeDirIfNeeded, BRONZE_DATA } from './common.js';
import path from 'path';

export async function extractResponsibilities(rootFolder) {
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
            if (fileName.endsWith(".html")) {
                const sourceFullFilePath = `${sourceFileFolder}/${fileName}`;
                extractResponsibilitiesFromSingleJob(jobRole, sourceFullFilePath)

            }
        });
    });
}

function extractResponsibilitiesFromSingleJob(jobRole, sourceFullFilePath) {
    console.log(`Processing file: ${sourceFullFilePath}`);

    //jobDescriptionText
    const pageDataHtml = fs.readFileSync(sourceFullFilePath, 'utf8');
    const $ = cheerio.load(pageDataHtml);

    let jobDescriptionElement = $("#jobDescriptionText");
    const jobDescription = jobDescriptionElement.text();

    // Extract sentences from the data
    //const sentences = se.extractSentences(jobDescription);

    //Create a new file to store the output
    const destinationRootFolder = BRONZE_DATA
    makeDirIfNeeded(destinationRootFolder);

    const destinationFolder = `${destinationRootFolder}/${jobRole}`;
    makeDirIfNeeded(destinationFolder);

    let fileName = path.basename(sourceFullFilePath);
    const destinationFilePath = `${destinationFolder}/${fileName}.txt`;

    fs.writeFileSync(destinationFilePath, jobDescription);
    console.log(`Extracted job description from: ${sourceFullFilePath} to file: ${destinationFilePath}\n`);

    /*
    sentences.forEach(async (sentence, index) => {
        const embedding = await st.createEmbedding(sentence);
        destinationWriteStream.write(`${index}:${embedding.length}:${sentence.trim()}\n`);
    });
    */
}
