import fs from 'fs';

import { scrapeRawData } from './jobExtractor.js';
import * as st from '../sentenceTransformer.js';
import { extractSentences } from '../sentenceExtractor.js';
import { extractResponsibilities } from './jobResponsibilityExtractor.js';
import { BRONZE_DATA, RAW_JOB_DATA } from './common.js';

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

  //RAW
  //Scrape raw data to RAW_JOB_DATA folder
  //await scrapeRawData(jobRole, location);

  //BRONZE
  //Extract job responsibilities to BRONZE data folder
  //await extractResponsibilities(RAW_JOB_DATA);

  //SILVER
  //Extract sentences from job responsibilities to SILVER data folder
  await extractSentences(BRONZE_DATA);


  console.log(`Finished processing Job Role: ${jobRole}\nLocation: ${location}\n`);
}
