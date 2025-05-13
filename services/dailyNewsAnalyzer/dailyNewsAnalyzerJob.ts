import prisma from 'common/prisma/prisma';
import analyzeNews from './analyzeNews';

export const queries = ['NASDAQ, S&P 500', 'stock market', 'economy', 'business'];

async function dailyNewsAnalyzerJob() {
  const todayString = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  for (const query of queries) {
    const analysis = await analyzeNews(yesterdayString, todayString, query);
    if (!analysis || !analysis.rating || !analysis.summary) {
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
