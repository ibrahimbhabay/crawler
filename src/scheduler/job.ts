import cron  from 'node-cron'
import { scrap } from '../main'

//INFO: job will be triggered every day at 10:00 am.
export const startJobScheduler = () => {
    cron.schedule('0 10 * * *', () => {
        console.log(`Starting webscraping task at ${Date.now()}`);
        scrap();
    });
}