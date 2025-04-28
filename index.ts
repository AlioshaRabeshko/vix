import 'dotenv/config'
import cron from 'node-cron';
import putCallRatioSyncJob from 'services/callPutRatio/putCallRatioSyncJob';
import dailyNewsAnalyzerJob from 'services/dailyNewsAnalyzer/dailyNewsAnalyzerJob';
import googleTrendsJob from 'services/googleTrends/googleTrendsJob';
import stockDataSyncJob from 'services/stockData/stockDataSyncJob';
import updateFearIndexJob from 'services/fearIndex/updateFearIndexJob';

cron.schedule('0 2,18 * * *', () => { // every day at 2 AM and 6 PM
  googleTrendsJob().catch((error) => console.error('Error running googleTrendsJob:', error))
});

cron.schedule('0 10,12,16,23 * * *', () => { // every day at 10 AM, 12 AM, 4 PM, and 11 PM
  putCallRatioSyncJob().catch((error) => console.error('Error running putCallRatioSyncJob:', error))
});

cron.schedule('0 12,16,23 * * *', () => { // every day at 12 AM, 4 PM, and 11 PM
  dailyNewsAnalyzerJob().catch((error) => console.error('Error running dailyNewsAnalyzerJob:', error))
});

cron.schedule('*/20 * * * *', () => { // every 20 minutes
  stockDataSyncJob().catch((error) => console.error('Error running stockDataSyncJob:', error))
});

cron.schedule('*/20 * * * *', () => { // every 20 minutes
  updateFearIndexJob().catch((error) => console.error('Error running updateFearIndexJob:', error))
});