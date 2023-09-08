import fs from 'fs';

import { scrapeRawData } from './jobExtractor.js';
import * as st from './sentenceTransformer.js';
import * as se from './sentenceExtractor.js';


const BRONZE_DATA = 'BRONZE_DATA';
const SILVER_DATA = 'SILVER_DATA';
const GOLD_DATA = 'GOLD_DATA';

//Call the main function to start the program
main();

async function main() {
  try {
    const jobRoles = ["DevOps+Engineer", "Data+Engineer", "Cloud+Engineer", "Site-reliability+Engineer", "AI+Engineer"];
    const location = "Redmond+WA";

    for (const jobRole of jobRoles) {
      await processJobRole(jobRole, location);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function processJobRole(jobRole, location) {
  console.log(`Processing Job Role: ${jobRole}\nLocation: ${location}\n`);

  //BRONZE
  //Scrape raw data from the URL
  await scrapeRawData(jobRole, location);

  //SILVER
  //Extract responsibilities to Silver data folder
  //await extractResponsibilities(jobRole, location);

  console.log(`Finished processing Job Role: ${jobRole}\nLocation: ${location}\n`);
}


async function extractResponsibilities(jobRole, location) {
  const rootFolder = BRONZE_DATA
  const parentFolder = `${jobRole}_${location}`;
  const sourceFolder = `${rootFolder}/${parentFolder}`;

  console.log(`[Silver] Processing folder: ${sourceFolder}`);

  const files = fs.readdirSync(sourceFolder)

  //process all files using forEach
  files.forEach(async function (fileName) {
    if (fileName.endsWith("html")) {
      await extractResponsibilitiesFromSingleJob(jobRole, location, fileName);
    }
  });
}

async function extractResponsibilitiesFromSingleJob(jobRole, location, fileName) {
  const parentFolder = `${jobRole}_${location}`;
  const sourceRootFolder = BRONZE_DATA;
  const sourceFullFilePath = `${sourceRootFolder}/${parentFolder}/${fileName}`;

  console.log(`Processing file: ${sourceFullFilePath}`);

  //jobDescriptionText
  const pageDataHtml = fs.readFileSync(sourceFullFilePath, 'utf8');
  const $ = cheerio.load(pageDataHtml);

  let jobDescriptionElement = $("#jobDescriptionText");
  const jobDescription = jobDescriptionElement.text();

  // Extract sentences from the data
  const sentences = se.extractSentences(jobDescription);

  //Create a new file to store the output
  const destinationRootFolder = SILVER_DATA
  await makeDirIfNeeded(destinationRootFolder);

  const destinationFolder = `${destinationRootFolder}/${parentFolder}`;
  await makeDirIfNeeded(destinationFolder);

  const destinationFilePath = `${destinationFolder}/${fileName}.txt`;
  var destinationWriteStream = fs.createWriteStream(destinationFilePath);

  sentences.forEach(async (sentence, index) => {
    const embedding = await st.createEmbedding(sentence);
    destinationWriteStream.write(`${index}:${embedding.length}:${sentence.trim()}\n`);
  });
}


async function getJobDescription(jobId) {
}
