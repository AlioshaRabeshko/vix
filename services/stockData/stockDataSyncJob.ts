import prisma from 'common/prisma/prisma';
import yahooFinance from 'yahoo-finance2';

async function getETFData(ticker: string) {
  const result = await yahooFinance.quoteSummary(ticker, {
    modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData', 'price'],
  });

  if (!result || !result.price || result.price.marketState === 'CLOSED') {
    return null;
  }

  const price = result.price?.regularMarketPrice|| null;
  const trailingPe = result.summaryDetail?.trailingPE || null;
  const forwardPe = result.defaultKeyStatistics?.forwardPE || null

  return {price, forwardPe, trailingPe};
};

async function syncTickers(tickers: string[]) {
  for (const ticker of tickers) {
    const data = await getETFData(ticker);

    if (!data) {
      continue;
    }
    
    await prisma.stock_data.create({data: {...data, ticker}});
  }
}
  

async function stockDataSyncJob() {
  await syncTickers(['QQQm', 'VOO', 'BRK-B', 'SCHD', 'JNK']);
}

export async function macroEconomicSyncJob() {
  await syncTickers(['DX-Y.NYB', '^GSPC', '^IXIC', 'GC=F', '^VXN', '^VIX']);
}

export default stockDataSyncJob;