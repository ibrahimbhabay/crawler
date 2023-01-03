import puppeteer, { Browser, Page } from "puppeteer";
import UserAgents from 'user-agents';
import mongoose from "mongoose";
import { setupDotenv } from "./config/dotenv.setup";
import { searchKeywords, DEFAULT_SEARCH_RANDOM_INDEX, DEFAULT_TARGET_URL, DEFAULT_START_PAGE, DEFAULT_END_PAGE } from "./data/search.data";
import { generateRandomIntegerBetweenTwoNumbers } from "./utils/math.util";
import { gotoPageWithRetry } from "./utils/web.util";
import { ElementSelectorsEnum } from "./utils/selectors.enum";
import { scrapeProductDetailPageUrls, scrapeProductDetail } from './sevices/scrape.service';
import { startJobScheduler } from "./scheduler/job";

setupDotenv();

const TARGET_URL = process.env.TARGET_URL || DEFAULT_TARGET_URL;
const START_PAGE = parseInt(process.env.START_PAGE) || DEFAULT_START_PAGE;
const END_PAGE = parseInt(process.env.END_PAGE) || DEFAULT_END_PAGE;

//INFO: uncomment startJobScheduler() on line 57 to make the web crawler run everyday at 10:00 am.
const connectDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, ()=> {
            console.log('Database connection successfully established.');
        });
    }catch(error){
        console.log('Error occured in establishing database connection.');
        console.log(error);
    }
}

export const scrap = async () : Promise<void> => {
    try{
        console.log(`Scraping ${TARGET_URL} started.`)
        let randomIndex = generateRandomIntegerBetweenTwoNumbers(0, searchKeywords.length - 1);
        let searchString = randomIndex >= 0 && (randomIndex <= (searchKeywords.length - 1)) ? searchKeywords[randomIndex] : searchKeywords[DEFAULT_SEARCH_RANDOM_INDEX];
        console.log(`Searching for product: ${searchString}`) ;
    
        const browser: Browser = await puppeteer.launch({ headless: true});
        const page: Page = await browser.newPage();
        const userAgent = new UserAgents();
        await page.setUserAgent( userAgent.random().toString());
        await gotoPageWithRetry(page, TARGET_URL);
        await page.waitForSelector(ElementSelectorsEnum.searchBarId,  {timeout: 1000 * 10});
        await page.type(ElementSelectorsEnum.searchFieldId, searchString);
        await Promise.all([ page.click(ElementSelectorsEnum.searchSubmitButtonId), page.waitForNavigation()]);

        let productDetailPageUrlList: string[] = await scrapeProductDetailPageUrls(page, START_PAGE, END_PAGE);
        if(productDetailPageUrlList.length){
            console.log(`Number of products to scrap ${productDetailPageUrlList.length}.`);
            await scrapeProductDetail(productDetailPageUrlList, page);
        }else{
            console.log('No products to scrape.');
        }
    } catch(error){
        console.log('Error occured while scraping.');
        console.log(error);
    }
}


connectDatabase();
scrap();
//startJobScheduler();
