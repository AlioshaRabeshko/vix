import {queries} from 'services/dailyNewsAnalyzer/dailyNewsAnalyzerJob';
import prisma from 'services/prisma/prisma';

async function getVolatilityIndex(toDate: Date) {
  const {price} = await prisma.stock_data.findFirst({
    select: {price: true},
    where: {ticker: '^VIX', timestamp: {lte: toDate}},
    orderBy: {timestamp: 'desc'},
  });

  return price;
}

async function getPutCallRatio(toDate: Date) {
  const {value} = await prisma.put_call_ratio.findFirst({
    select: {value: true},
    where: {timestamp: {lte: toDate}},
    orderBy: {timestamp: 'desc'},
  });

  return value;
}

async function getNewsFearIndex(toDate: Date) {
  const data = await prisma.daily_news_analysis.findMany({
    select: {rating: true},
    where: {timestamp: {lte: toDate}},
    orderBy: {timestamp: 'desc'},
    take: queries.length
  });

  return data.reduce((acc, {rating}) => acc + rating, 0) / data.length;
}

async function getStockWeeklyChange(ticker: string) {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);

  const data = await prisma.stock_data.findMany({
    select: {price: true},
    where: {
      ticker,
      timestamp: {gte: weekAgo, lte: today},
    },
    orderBy: {timestamp: 'asc'},
  });

  if (data.length < 2) return null;

  const startPrice = data[0].price;
  const endPrice = data[data.length - 1].price;

  return (endPrice - startPrice) / startPrice;
}

async function getGoogleTrendsFearIndex(toDate: Date) {
  const utcDate = new Date(Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()));
  const data = await prisma.google_trends.findMany({
    select: {value: true},
    where: {date: utcDate},
    orderBy: {timestamp: 'desc'}
  });

  return data.reduce((acc, {value}) => acc + value, 0) / data.length;
}

async function getFearIndex() {
  const today = new Date();

  const volatilityIndex = await getVolatilityIndex(today); // scale 10–20: 0–1, 20–30: 1–1.5, 30–40: 1.5–2
  const putCallRatio = await getPutCallRatio(today); // >1.1 — 1 бал, >1.3 — 1.5
  const newsFearIndex = await getNewsFearIndex(today); // scale 0-2
  const qqqmWeeklyChange = await getStockWeeklyChange('QQQm'); // падіння 5% = 1 бал
  const hyBondsWeeklyChange = await getStockWeeklyChange('JNK'); // падіння 5% = 1 бал
  const goldWeeklyChange = await getStockWeeklyChange('GLD'); // зростання 5% = 1 бал
  const googleTrendsFearIndex = await getGoogleTrendsFearIndex(today); // scale 0-1

  const normalizedVolatilityIndex = volatilityIndex / 20;
  const normalizedPutCallRatio = putCallRatio > 1.3 ? 1.5 : putCallRatio > 1.1 ? 1 : 0;
  const normalizedNewsFearIndex = newsFearIndex > 7 ? 2 : newsFearIndex > 4 ? 1 : 0;
  const normalizedQQQMWeeklyChange = qqqmWeeklyChange <= 0.95 ? 1 : 0;
  const normalizedHYBondsWeeklyChange = hyBondsWeeklyChange <= 0.95 ? 1 : 0;
  const normalizedGoldWeeklyChange = goldWeeklyChange >= 1.05 ? 1 : 0;
  const normalizedGoogleTrendsFearIndex = googleTrendsFearIndex ? googleTrendsFearIndex / 100 : 0;

  return normalizedVolatilityIndex + normalizedPutCallRatio + normalizedNewsFearIndex +
    normalizedQQQMWeeklyChange + normalizedHYBondsWeeklyChange + normalizedGoldWeeklyChange +
    normalizedGoogleTrendsFearIndex;
}

export default getFearIndex;