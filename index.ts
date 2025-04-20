import 'dotenv/config'
import putCallRatioSyncJob from 'services/callPutRatio/putCallRatioSyncJob';
import dailyNewsAnalyzerJob from 'services/dailyNewsAnalyzer/dailyNewsAnalyzerJob';
import getFearIndex from 'services/fearIndex/getFearIndex';
import googleTrendsJob from 'services/googleTrends/googleTrendsJob';
import stockDataSyncJob from 'services/stockData/stockDataSyncJob';



async function main() {
  try {
    await dailyNewsAnalyzerJob();
  } catch (error) {
    console.error('Error running dailyNewsAnalyzerJob:', error);
  }

  try {
    await putCallRatioSyncJob();
  } catch (error) {
    console.error('Error running putCallRatioSyncJob:', error);
  }

  try {
    await stockDataSyncJob();
  } catch (error) {
    console.error('Error running stockDataSyncJob:', error);
  }

  try {
    await googleTrendsJob();
  } catch (error) {
    console.error('Error running googleTrendsJob:', error);
  }
}

main();