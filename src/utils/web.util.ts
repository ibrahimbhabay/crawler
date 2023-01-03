import { Page } from "puppeteer";

const NAVIGATION_TIMEOUT_SECONDS = 100;
const NAVIGATION_TIMEOUT_MILLISECONDS = NAVIGATION_TIMEOUT_SECONDS * 1000;
const PAGE_RESPONSE_TIMEOUT_MILLISECONDS = 9000;

export const gotoPageWithRetry = async (page : Page, url: string, retryCount: number = 3) => {
    if (retryCount < 0) {
      throw new Error(`Navigation to ${url} failded after ${retryCount} retries.`);
    }
    await Promise.all([
      page.goto(url, {
        timeout: NAVIGATION_TIMEOUT_MILLISECONDS,
        waitUntil: 'load',
      }),
      page.waitForResponse((response) => response.ok(), { timeout: PAGE_RESPONSE_TIMEOUT_MILLISECONDS }),
    ]).catch(() => {
        gotoPageWithRetry(page, url, retryCount - 1);
    });
  };