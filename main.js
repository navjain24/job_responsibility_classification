const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const natural = require('natural');
// Tokenizer for Natural library
const tokenizer = new natural.SentenceTokenizer();


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

  const parentFolder = `${jobRole}_${location}`;
  await makeDirIfNeeded(parentFolder);

  const destinationFolder = `${parentFolder}/${BRONZE_DATA}`;
  await makeDirIfNeeded(destinationFolder);

  fs.writeFileSync(`${destinationFolder}/${jobId}.html`, rawDetail);      
  return rawDetail;
}

async function extractResponsibilities(jobRole, location)
{
  const parentFolder = `${jobRole}_${location}`;
  
  const sourceFolder = `${parentFolder}/${BRONZE_DATA}`;
  const destinationFolder = `${parentFolder}/${SILVER_DATA}`;
  await makeDirIfNeeded(destinationFolder);

  const destinationFilePath = `${destinationFolder}/sentences.txt`;


  console.log(`[Silver] Processing folder: ${sourceFolder}`);

  const files = fs.readdirSync(sourceFolder)

  //process all files using forEach
  files.forEach(async function (file) {      
    if(file.endsWith("html"))
    {  
      const fullFilePath = `${parentFolder}/${BRONZE_DATA}/${file}`;
      await extractResponsibilitiesFromSingleJob(fullFilePath);
    }
  });
}

async function extractResponsibilitiesFromSingleJob(fullFilePath)
{
  console.log(`Processing file: ${fullFilePath}`); 

  //jobDescriptionText
  const pageDataHtml = fs.readFileSync(fullFilePath, 'utf8');
  const $ = cheerio.load(pageDataHtml);
  
  let jobDescriptionElement = $("#jobDescriptionText");
  const jobDescription = jobDescriptionElement.text();

  const sentences = await tokenizer.tokenize(jobDescription);
   
  //Create a new file to store the output
  const destinationFilePath = `${fullFilePath}.txt`;
  var destinationWriteStream = fs.createWriteStream(destinationFilePath);
  
  sentences.forEach((sentence, index) => {
    destinationWriteStream.write(`${index}:${sentence.trim()}\n`);
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
