const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const INDEED_URL = 'https://www.indeed.com';
const BRONZE_DATA = 'BRONZE_DATA';
const SILVER_DATA = 'SILVER_DATA';
const GOLD_DATA = 'GOLD_DATA';

async function getJobIdsFromJobSearchSite(url) {    
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);

  //await page.screenshot({path: 'screenshot.png'});

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

    try {
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder);
      }
    } catch (err) {
      console.error(err);
      throw err
    }

    fs.writeFileSync(`${destinationFolder}/${jobId}.html`, rawDetail);      
    return rawDetail;
}

async function getJobDescription(jobId) {
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

  console.log(`Scraped raw data for Job Role: ${jobRole}; Location: ${location}; data located at: /${BRONZE_DATA}/\n`);
}
  
async function processJobRole(jobRole, location)
{
  console.log(`Processing Job Role: ${jobRole}\nLocation: ${location}\n`);

  //BRONZE
  //Scrape raw data from the URL
  await scrapeRawData(jobRole, location);

  //SILVER
  //Extract responsibilities to Silver data folder
  //TODO
  console.log(`Finished processing Job Role: ${jobRole}\nLocation: ${location}\n`);
}

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

  
  //Call the main function to start the program
main();

