import prisma from 'common/prisma/prisma';
import yahooFinance from 'yahoo-finance2';

async function getETFData(ticker: string) {
  const result = await yahooFinance.quoteSummary(ticker, {
    modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'price'],
  });

  const price = result.price?.regularMarketPrice|| null;
  const trailingPe = result.summaryDetail?.trailingPE || null;
  const forwardPe = result.defaultKeyStatistics?.forwardPE || null

  return {price, forwardPe, trailingPe};
};

async function stockDataSyncJob() {
  for (const ticker of ['QQQm', 'VOO', 'BRK-B', 'SCHD', 'JNK']) {
    const data = await getETFData(ticker);
    
    await prisma.stock_data.create({data: {...data, ticker}});
  }
}

export async function macroEconomicSyncJob() {
  for (const ticker of ['DX-Y.NYB', '^GSPC', '^IXIC', 'GC=F', '^VXN', '^VIX']) {
    const data = await getETFData(ticker);
    
    await prisma.stock_data.create({data: {...data, ticker}});
  }
}

export default stockDataSyncJob;