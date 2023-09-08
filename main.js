import fs from 'fs';

import { scrapeRawData } from './jobExtractor.js';
import * as st from './sentenceTransformer.js';
import * as se from './sentenceExtractor.js';
import { extractResponsibilities } from './jobResponsibilityExtractor.js';
import { RAW_JOB_DATA } from './common.js';

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
  //Scrape raw data from the URL
  await scrapeRawData(jobRole, location);

  //SILVER
  //Extract responsibilities to Silver data folder
  //await extractResponsibilities(RAW_JOB_DATA);

  console.log(`Finished processing Job Role: ${jobRole}\nLocation: ${location}\n`);
}
