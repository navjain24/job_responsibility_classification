import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';
import { makeDirIfNeeded } from './common.js';
import { BRONZE_DATA } from './common.js';

const INDEED_URL = 'https://www.indeed.com';

export async function scrapeRawData(jobRole, location) {
    const jobIds = await getJobIdsFromIndeed(jobRole, location);
    console.log(`Found ${jobIds.length} job listings on the job search site.`);

    // Write raw descriptions to file(s) (BRONZE)
    let promises = [];
    for (const jobId of jobIds) {
        try {
            promises.push(await getRawJobDetailPage(jobRole, location, jobId));
        } catch (err) {
            console.error(err);
        }
    }

    Promise.all(promises);
    console.log(`Scraped raw data for Job Role: ${jobRole}; Location: ${location}`);
}


async function getRawJobDetailPage(jobRole, location, jobId) {
    const jobUrl = `${INDEED_URL}/viewjob?jk=${jobId}`;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(jobUrl);

    const rawDetail = await page.evaluate(() => {
        return document.documentElement.innerHTML;
    });

    await browser.close();

    const rootFolder = BRONZE_DATA
    makeDirIfNeeded(rootFolder);

    const parentFolder = `${jobRole}`;
    const destinationFolder = `${rootFolder}/${parentFolder}`;
    makeDirIfNeeded(destinationFolder);

    let destinationFileName = `${destinationFolder}/${jobId}.html`;
    fs.writeFileSync(destinationFileName, rawDetail);
    console.log(`Extracted details for Job ID: ${jobId} at file:${destinationFileName}\n`);

    return rawDetail;
}


async function getJobIdsFromIndeed(jobRole, location) {
    const searchUrl = `${INDEED_URL}/jobs?q=${jobRole}&l=${location}&sc=0kf:jt(fulltime);`;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(searchUrl);

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
        };
    });

    await browser.close();

    const $ = cheerio.load(pageData.html);

    let mosaicJobResults = $('#mosaic-jobResults')
    let jobCards = mosaicJobResults.find('div.mosaic-provider-jobcards');
    let cardOutlines = jobCards.find('div.cardOutline');

    let jobIds = [];

    cardOutlines.each((index, element) => {
        //Job URL
        let jobSeenBeacon = $(element).find('div.job_seen_beacon a');
        let jobId = $(jobSeenBeacon).attr('data-jk');

        console.log(`Found job id: ${jobId}`);
        jobIds.push(jobId);
    });

    return jobIds;
}
