import 'dotenv/config'
import cron from 'node-cron';
import putCallRatioSyncJob from 'services/callPutRatio/putCallRatioSyncJob';
import dailyNewsAnalyzerJob from 'services/dailyNewsAnalyzer/dailyNewsAnalyzerJob';
import googleTrendsJob from 'services/googleTrends/googleTrendsJob';
import stockDataSyncJob, {macroEconomicSyncJob} from 'services/stockData/stockDataSyncJob';
import updateFearIndexJob from 'services/fearIndex/updateFearIndexJob';
import syncCryptoDataJob from 'services/syncCryptoData/syncCryptoDataJob';
import serverLogger from 'common/logger/serverLogger';

serverLogger.info('Starting cron server');
serverLogger.info('Starting cron server');
serverLogger.info('Starting cron server');
serverLogger.info('Starting cron server');

cron.schedule('0 2,18 * * *', () => { // every day at 2 AM and 6 PM
  googleTrendsJob()
    .then(() => serverLogger.info('googleTrendsJob completed successfully'))
    .catch((error) => serverLogger.error('Error running googleTrendsJob:', error))
});

cron.schedule('0 10,12,16,23 * * *', () => { // every day at 10 AM, 12 AM, 4 PM, and 11 PM
  putCallRatioSyncJob()
    .then(() => serverLogger.info('putCallRatioSyncJob completed successfully'))
    .catch((error) => serverLogger.error('Error running putCallRatioSyncJob:', error))
});

cron.schedule('0 12,16,23 * * *', () => { // every day at 12 AM, 4 PM, and 11 PM
  dailyNewsAnalyzerJob()
    .then(() => serverLogger.info('dailyNewsAnalyzerJob completed successfully'))
    .catch((error) => serverLogger.error('Error running dailyNewsAnalyzerJob:', error))
});

cron.schedule('*/5 * * * *', () => { // every 5 minutes
  stockDataSyncJob()
    .then(() => serverLogger.info('googleTrendsJob completed successfully'))
    .catch((error) => serverLogger.error('Error running stockDataSyncJob:', error))
});

cron.schedule('*/5 * * * *', () => { // every 5 minutes
  macroEconomicSyncJob()
    .then(() => serverLogger.info('macroEconomicSyncJob completed successfully'))
    .catch((error) => serverLogger.error('Error running macroEconomicSyncJob:', error))
});

cron.schedule('*/5 * * * *', () => { // every 5 minutes
  updateFearIndexJob()
    .then(() => serverLogger.info('updateFearIndexJob completed successfully'))
    .catch((error) => serverLogger.error('Error running updateFearIndexJob:', error))
});

cron.schedule('*/15 * * * *', () => { // every 15 minutes
  syncCryptoDataJob()
    .then(() => serverLogger.info('syncCryptoDataJob completed successfully'))
    .catch((error) => serverLogger.error('Error running syncCryptoDataJob:', error))
});
