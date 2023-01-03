import { Page } from "puppeteer";
import { IProduct } from "../product/interface/product.interface";
import { gotoPageWithRetry } from "../utils/web.util";
import { ElementSelectorsEnum } from '../utils/selectors.enum';
import { nanoid } from 'nanoid';
import { saveProduct } from './product.database.service'


const PAGE_NAVIGATION_RETRY = 3;

export const scrapeProductDetailPageUrls = async ( page: Page, startPage: number = 1, endPage: number = 1) : Promise<string[]>  => {
    console.log('scraping page urls.')
    let productPageUrlList: string[] = [];
    for(let pageNumber: number = startPage; pageNumber <= endPage; pageNumber++){
        try{
            let urls: string[] = await page.$$eval(ElementSelectorsEnum.productLink, (elements) =>  elements.map( element => (element as HTMLAnchorElement).href))
            productPageUrlList.push(...urls) 
            if(pageNumber <= endPage ){
                await page.click(ElementSelectorsEnum.nextPageButtonClass)
                await page.waitForSelector(ElementSelectorsEnum.nextPageButtonClass)
            }
        }catch(error){
            console.log(error);
            console.log(`Error occured while scraping page detail Urls for page number: ${pageNumber}`)
        }
        // await Promise.all([ nextPageButton.click(), page.waitForNavigation() ]) ;
    }
    return productPageUrlList;
}

export const scrapeProductDetail = async (productPageURLs: string[], page: Page) : Promise<void> => {   
    console.log('Scraping product details.')
    for( const pageUrl of productPageURLs ){
        let productData : Partial<IProduct> = {};
        try{
            await gotoPageWithRetry(page, pageUrl, PAGE_NAVIGATION_RETRY)
            await page.waitForSelector(ElementSelectorsEnum.productDescriptionPageIntroSectionId);
    
            productData =  await page.$eval( ElementSelectorsEnum.productDescriptionPageIntroSectionId, (element) => ({
                title: (element.querySelector('#titleSection h1 span#productTitle') as HTMLElement)?.innerText,
                price: parseFloat(((element.querySelector('#corePriceDisplay_desktop_feature_div span.priceToPay span.a-offscreen') as HTMLElement)?.innerText)?.replace(/\$|€/g,'')), 
                numberOfReviews: parseInt(((element.querySelector('#averageCustomerReviews_feature_div a span#acrCustomerReviewText') as HTMLElement)?.innerText)?.split(' ')[0]?.replace(/\D/g,'')),
                averageRating: parseFloat(((element.querySelector('#averageCustomerReviews_feature_div a i.a-icon-star span.a-icon-alt') as HTMLElement)?.innerText)?.split(' ')[0]),
            }) )
    
           let dateListed: string = await page.$$eval(ElementSelectorsEnum.productDateListedClass,
             (elements) => (elements[elements.length - 1] as HTMLElement)?.innerText);
            
            if(isNaN(new Date(dateListed).getTime())){
                dateListed = dateListed.substring(1);
            }
            
            productData.dateFirstListed = new Date(dateListed);
            productData.dateFristListedTimestamp = new Date(dateListed)?.getTime();
            console.log(JSON.stringify(productData))
            await saveProduct(productData);
        }catch(error){
            console.log(error);
            console.log(`Error occured while scraping product details`);
        }
    } 
}

