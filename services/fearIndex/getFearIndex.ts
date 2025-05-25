import prisma from 'common/prisma/prisma';
import {groupBy} from 'lodash';
import getZScore from 'common/statUtils/getZScore';

async function getPutCallRatio(fromDate: Date, toDate: Date) {
  const data = await prisma.put_call_ratio.findMany({
    select: {value: true},
    where: {timestamp: {lte: toDate, gte: fromDate}},
    orderBy: {timestamp: 'desc'},
  });

  return data.map(({value}) => value);
}

async function getNewsFearIndex(fromDate: Date, toDate: Date) {
  const data = await prisma.daily_news_analysis.findMany({
    select: {rating: true, query: true},
    where: {timestamp: {lte: toDate, gte: fromDate}},
    orderBy: {timestamp: 'desc'}
  });

  const groupedData = groupBy(data, 'query');
  const groupedResult: {[key in string]: number[]} = {};
  for (const key of Object.keys(groupedData)) {
    groupedResult[key] = groupedData[key].map(({rating}) => rating);
  }

  return groupedResult;
}

async function getTickerData(ticker: string, fromDate: Date, toDate: Date) {
  const data = await prisma.stock_data.findMany({
    select: {price: true},
    where: {
      ticker,
      timestamp: {lte: toDate, gte: fromDate},
    },
    orderBy: {timestamp: 'desc'},
  });

  return data.map(({price}) => price);
}

async function getGoogleTrendsData(fromDate: Date, toDate: Date) {
  const data = await prisma.google_trends.findMany({
    select: {value: true, keyword: true},
    where: {date: {lte: toDate, gte: fromDate}, keyword: {notIn: ['bitcoin', 'ethereum']}},
    orderBy: {timestamp: 'desc'}
  });

  const groupedData = groupBy(data, 'keyword');
  const groupedResult: {[key in string]: number[]} = {};
  for (const key of Object.keys(groupedData)) {
    groupedResult[key] = groupedData[key].map(({value}) => value);
  }

  return groupedResult;
}

async function getCnnFearGreedIndex(fromDate: Date, toDate: Date) {
  const data = await prisma.cnn_data.findMany({
    select: {value: true},
    where: {date: {lte: toDate, gte: fromDate}, keyword: 'fear_and_greed_historical'},
    orderBy: {date: 'desc'},
  });

  return data.map(({value}) => value);
}

async function getFearIndex(fromDate: Date, toDate: Date) {
  const ninetyDaysAgo = new Date(toDate);
  ninetyDaysAgo.setDate(fromDate.getDate() - 90);

  const [lastPutCallRatio, ...restPutCallRation] = await getPutCallRatio(fromDate, toDate);
  const putCallRatioZScore = getZScore(lastPutCallRatio, restPutCallRation);

  const newsFearIndexData = await getNewsFearIndex(ninetyDaysAgo, toDate);
  let newsAvgZScore = 0;
  for (const [, [lastNewsIndex, ...restNewsIndex]] of Object.entries(newsFearIndexData)) {
    newsAvgZScore += getZScore(lastNewsIndex, restNewsIndex);
  }
  newsAvgZScore /= Object.keys(newsFearIndexData).length;

  const googleTrendsData = await getGoogleTrendsData(ninetyDaysAgo, toDate);
  let googleTrendsAvgZScores = 0;
  for (const [, [lastGoogleTrendsIndex, ...restGoogleTrendsIndex]] of Object.entries(googleTrendsData)) {
    googleTrendsAvgZScores += getZScore(lastGoogleTrendsIndex, restGoogleTrendsIndex);
  }
  googleTrendsAvgZScores /= Object.keys(googleTrendsData).length;
  
  const [lastVolatilityIndex, ...restVolatilityIndex] = await getTickerData('^VXN', fromDate, toDate); // Nasdaq volatility index
  const volatilityIndexZScore = getZScore(lastVolatilityIndex, restVolatilityIndex);

  const [lastNasdaqIndex, ...restNasdaqIndex] = await getTickerData('^IXIC', fromDate, toDate); // Nasdaq index
  const nasdaqZScore = getZScore(lastNasdaqIndex, restNasdaqIndex);

  const [lastGoldPrice, ...restGoldPrices] = await getTickerData('GC=F', fromDate, toDate); // Gold price
  const goldZScore = getZScore(lastGoldPrice, restGoldPrices);

  const [lastDxyIndex, ...restDxyIndex] = await getTickerData('DX-Y.NYB', fromDate, toDate); // US Dollar Index
  const dxyZScore = getZScore(lastDxyIndex, restDxyIndex);

  const normalizedPutCallRatio = 0.2  * putCallRatioZScore;
  const normalizedNewsFearIndex = 0.15 * newsAvgZScore;
  const normalizedGoogleTrendsFearIndex = 0.1 * googleTrendsAvgZScores;
  const normalizedVolatilityIndex = 0.25 * volatilityIndexZScore;
  const normalizedNasdaqIndex = -0.2 * nasdaqZScore;
  const normalizedGoldPrice = 0.15 * goldZScore;
  const normalizedDxyIndex = -0.1 * dxyZScore;

  const fearIndex = normalizedPutCallRatio + normalizedNewsFearIndex +
    normalizedGoogleTrendsFearIndex + normalizedVolatilityIndex + normalizedNasdaqIndex +
    normalizedGoldPrice + normalizedDxyIndex;
  return (fearIndex + 1) * 5;
}

export async function getWeekFearIndex() {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);
  return await getFearIndex(weekAgo, today);
}

export async function getMonthFearIndex() {
  const today = new Date();
  const monthAgo = new Date();
  monthAgo.setMonth(today.getMonth() - 1);
  return await getFearIndex(monthAgo, today);
}
