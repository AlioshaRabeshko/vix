import prisma from 'services/prisma/prisma';
import analyzeDailyNews from './analyzeDailyNews';

export const queries = ['NASDAQ, S&P 500', 'stock market', 'economy', 'business'];

async function dailyNewsAnalyzerJob() {
  const todayString = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  for (const query of queries) {
    const analysis = await analyzeDailyNews(yesterdayString, todayString, query);
    if (!analysis) {
      continue;
    }

    await prisma.daily_news_analysis.create({
      data: {
        rating: analysis.rating,
        summary: analysis.summary,
        query: query,
      }
    })
  }
}

export default dailyNewsAnalyzerJob;
