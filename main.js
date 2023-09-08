import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';

import * as st from './sentenceTransformer.js';

//wink-nlp
import winkNlp from 'wink-nlp';
// Load english language model — light version.
import model from 'wink-eng-lite-web-model';
// Instantiate winkNLP.
const nlp = winkNlp( model );

/* const natural = require('natural');
// Tokenizer for Natural library
const tokenizer = new natural.SentenceTokenizer();
 */

const INDEED_URL = 'https://www.indeed.com';
const BRONZE_DATA = 'BRONZE_DATA';
const SILVER_DATA = 'SILVER_DATA';
const GOLD_DATA = 'GOLD_DATA';

//Call the main function to start the program
main();

async function main() {
  try {
    const jobRoles = ["DevOps+Engineer", "Data+Engineer", "Cloud+Engineer", "Site-reliability+Engineer", "AI+Engineer"];      
    const location = "Redmond+WA";

    for(const jobRole of jobRoles)
    {
      await processJobRole(jobRole, location);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function processJobRole(jobRole, location)
{
  console.log(`Processing Job Role: ${jobRole}\nLocation: ${location}\n`);

  //BRONZE
  //Scrape raw data from the URL
  //await scrapeRawData(jobRole, location);

  //SILVER
  //Extract responsibilities to Silver data folder
  await extractResponsibilities(jobRole, location);

  console.log(`Finished processing Job Role: ${jobRole}\nLocation: ${location}\n`);
}

async function scrapeRawData(jobRole, location)
{
  const searchUrl = `${INDEED_URL}/jobs?q=${jobRole}&l=${location}&sc=0kf:jt(fulltime);`;

  const jobIds = await getJobIdsFromJobSearchSite(searchUrl);
  console.log(`Found ${jobIds.length} job listings on the job search site.`);

  // Write raw descriptions to file(s) (BRONZE)
  for (const jobId of jobIds) {
    try {
      const rawDetail = await getRawJobDetailPage(jobRole, location, jobId);
      console.log(`Job ID: ${jobId}\nRaw Detail: ${rawDetail}\n`);      
    } catch (err) {
      console.error(err);
    }
  }

  console.log(`Scraped raw data for Job Role: ${jobRole}; Location: ${location}`);  
}

async function getJobIdsFromJobSearchSite(url) {    
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);

  const pageData = await page.evaluate(() => {
    return {
            html: document.documentElement.innerHTML,
    }; 
  });

  const $ = cheerio.load(pageData.html);

  let mosaicJobResults = $('#mosaic-jobResults')
  let jobCards = mosaicJobResults.find('div.mosaic-provider-jobcards');
  let cardOutlines = jobCards.find('div.cardOutline');

  jobIds = [];

  cardOutlines.each((index, element)=> {
    //Job URL
    let jobSeenBeacon = $(element).find('div.job_seen_beacon a');
    let jobId = $(jobSeenBeacon).attr('data-jk');

    console.log(jobId);

    //Snippet
    let jobSnippet = $(element).find('div.job-snippet');
    responsibility = jobSnippet.text();
    jobIds.push(jobId);
   });

  await browser.close();
  return jobIds;
}

async function getRawJobDetailPage(jobRole, location, jobId) {
  const url = `${INDEED_URL}/viewjob?jk=${jobId}`;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);

  const rawDetail = await page.evaluate(() => {
    return document.documentElement.innerHTML;
  });

  await browser.close();

  const rootFolder = BRONZE_DATA
  await makeDirIfNeeded(rootFolder);

  const parentFolder = `${jobRole}_${location}`;
  const destinationFolder = `${rootFolder}/${parentFolder}`;
  await makeDirIfNeeded(destinationFolder);

  fs.writeFileSync(`${destinationFolder}/${jobId}.html`, rawDetail);      
  return rawDetail;
}

async function extractResponsibilities(jobRole, location)
{
  const rootFolder = BRONZE_DATA
  const parentFolder = `${jobRole}_${location}`;
  const sourceFolder = `${rootFolder}/${parentFolder}`;

  console.log(`[Silver] Processing folder: ${sourceFolder}`);

  const files = fs.readdirSync(sourceFolder)

  //process all files using forEach
  files.forEach(async function (fileName) {      
    if(fileName.endsWith("html"))
    {  
      await extractResponsibilitiesFromSingleJob(jobRole, location, fileName);
    }
  });
}

async function extractResponsibilitiesFromSingleJob(jobRole, location, fileName)
{
  const parentFolder = `${jobRole}_${location}`;
  const sourceRootFolder = BRONZE_DATA;
  const sourceFullFilePath = `${sourceRootFolder}/${parentFolder}/${fileName}`;

  console.log(`Processing file: ${sourceFullFilePath}`); 

  //jobDescriptionText
  const pageDataHtml = fs.readFileSync(sourceFullFilePath, 'utf8');
  const $ = cheerio.load(pageDataHtml);
  
  let jobDescriptionElement = $("#jobDescriptionText");
  const jobDescription = jobDescriptionElement.text();

  // Read text
  const doc = nlp.readDoc( jobDescription );
  // Extract sentences from the data
  const sentences = doc.sentences().out();
   
  //Create a new file to store the output
  const destinationRootFolder = SILVER_DATA
  await makeDirIfNeeded(destinationRootFolder);

  const destinationFolder = `${destinationRootFolder}/${parentFolder}`;
  await makeDirIfNeeded(destinationFolder);

  const destinationFilePath = `${destinationFolder}/${fileName}.txt`;
  var destinationWriteStream = fs.createWriteStream(destinationFilePath);
  
  sentences.forEach(async (sentence, index) => {
    const embedding = await st.createEmbedding(sentence);
    destinationWriteStream.write(`${index}:${embedding}:${sentence.trim()}\n`);
  });
}

async function makeDirIfNeeded(dirName) {
  try {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
  } catch (err) {
    console.error(err);
    throw err
  }
}

async function getJobDescription(jobId) {
}
