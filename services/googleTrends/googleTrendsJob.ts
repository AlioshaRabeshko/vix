import googleTrends from 'google-trends-api';
import prisma from 'services/prisma/prisma';

export const keywords = [
  'recession',
  'layoffs',
  'usd collapse',
  'bank collapse',
  'financial crisis',

  'stock market crash',
  'stock market panic',

  'should I sell stocks',
  'should I pull out of the market'
];

export async function getGoogleTrends() {
  const now = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(now.getDate() - 30)
  const trendsData = [];

  for (const keyword of keywords) {
    try {
      const results = await googleTrends.interestOverTime({
        keyword,
        startTime: oneMonthAgo,
        endTime: now,
        geo: 'US',
      })

      const parsed = JSON.parse(results)
      const timeline = parsed.default.timelineData

      for (const point of timeline) {
        const value = point.value[0] as number
        const date = new Date(point.time * 1000).toISOString().split('T')[0]

        trendsData.push({
          keyword,
          date,
          value,
        })
      }
    } catch (err) {
      console.error(`Failed to fetch trend for "${keyword}":`, err)
    }

    await new Promise((resolve) => setTimeout(resolve, 10000))
  }
  return trendsData;
}

async function googleTrendsJob() {
  const trendsData = await getGoogleTrends();
  for (const {value, keyword, date} of trendsData) {
    await prisma.google_trends.upsert({
      where: {
        keyword_date: {
          keyword,
          date: new Date(date),
        },
      },
      update: {value},
      create: {
        keyword,
        value,
        date: new Date(date),
      },
    })
  }
}

export default googleTrendsJob;