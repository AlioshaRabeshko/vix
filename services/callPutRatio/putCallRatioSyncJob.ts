import axios from 'axios';
import prisma from 'services/prisma/prisma';

async function getTodayPutCallRatio() {
  const todayString = new Date().toISOString().split('T')[0];
  const response = await axios.get(`https://cdn.cboe.com/data/us/options/market_statistics/daily/${todayString}_daily_options`);

  return response.data.ratios.find((ratio) => ratio.name === 'TOTAL PUT/CALL RATIO')?.value || null;
}

async function putCallRatioSyncJob() {
  try {
    const ratio = await getTodayPutCallRatio();
    if (!ratio) {
      throw new Error('No ratio found');
    }

    await prisma.put_call_ratio.create({
      data: {value: ratio},
    });
  } catch (error) {
    console.error('Error fetching put/call ratio:', error);
    const {value: latestCallPutRatio} = await prisma.put_call_ratio.findFirst({
      select: { value: true },
      orderBy: { timestamp: 'desc' },
    });

    await prisma.put_call_ratio.create({
      data: {value: latestCallPutRatio},
    });
  }
}

export default putCallRatioSyncJob;