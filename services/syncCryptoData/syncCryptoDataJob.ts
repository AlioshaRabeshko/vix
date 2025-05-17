import axios from 'axios';
import {Interval, Spot} from '@binance/connector-typescript';
import prisma from 'common/prisma/prisma';
import serverLogger from 'common/logger/serverLogger';

async function getConfirmedTransactions() {
  const data = await axios.get('https://api.blockchain.info/charts/n-transactions?timespan=30days&sampled=true&metadata=false&daysAverageString=1d&cors=true&format=json')
  return data.data.values[data.data.values.length - 1].y;
}

async function getHashRate() {
  const data = await axios.get('https://api.blockchain.info/charts/hash-rate?timespan=30days&sampled=true&metadata=false&daysAverageString=7D&cors=true&format=json')
  return data.data.values[data.data.values.length - 1].y;
}

async function getFearGreedIndex() {
  const response = await axios.get('https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest', {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
    },
  });

  return response.data.data.value;
}

async function syncGlobalMetricsRequest() {
  const response = await axios.get('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
    },
  });

  const {data} = response.data;

  const fearGreedIndex = await getFearGreedIndex();
  const transactionCount = await getConfirmedTransactions();
  const hashRate = await getHashRate();

  await prisma.crypto_macro_data.create({
    data: {
      timestamp: new Date(),
      eth_dominance: data.eth_dominance,
      btc_dominance: data.btc_dominance,
      stablecoin_volume_24h: data.stablecoin_volume_24h,
      stablecoin_market_cap: data.stablecoin_market_cap,
      derivatives_volume_24h: data.derivatives_volume_24h,
      today_change_percent: data.today_change_percent,
  
      total_market_cap: data.quote.USD.total_market_cap,
      total_volume_24h: data.quote.USD.total_volume_24h,
      altcoin_market_cap: data.quote.USD.altcoin_market_cap,
      defi_market_cap: data.quote.USD.defi_market_cap,
      fear_index: fearGreedIndex,
      transactions: transactionCount,
      hash_rate: hashRate
    }
  });
}

async function syncMetadata() {
  const response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,USDT', {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
    },
  });

  const symbolData = [];
  for (const [symbol, value] of Object.entries(response.data.data)) {
    const data = (value as any).find(({name}) => ['Bitcoin', 'Ethereum', 'Tether USDt'].includes(name));

    symbolData.push({
      symbol: symbol,
      circulating_supply: data.circulating_supply,
      total_supply: data.total_supply,
      price: data.quote.USD.price,
      volume_24h: data.quote.USD.volume_24h,
      market_cap: data.quote.USD.market_cap,
      market_cap_dominance: data.quote.USD.market_cap_dominance,
      fully_diluted_market_cap: data.quote.USD.fully_diluted_market_cap
    });
  }

  await prisma.crypto_metadata.createMany({
    data: symbolData.map(({symbol, circulating_supply, total_supply, price, volume_24h, market_cap, market_cap_dominance, fully_diluted_market_cap}) => ({
      timestamp: new Date(),
      symbol,
      circulating_supply: String(circulating_supply),
      total_supply: String(total_supply),
      price: String(price),
      volume_24h: String(volume_24h),
      market_cap: String(market_cap),
      market_cap_dominance: String(market_cap_dominance),
      fully_diluted_market_cap: String(fully_diluted_market_cap),
    })),
    skipDuplicates: true,
  });
}

async function syncWhaleAlerts() {
  const endTime = Math.floor(Date.now() / 1000);
  const data = await axios.get(`https://whale-alert.io/alerts.json?start=1744927200&end=${endTime}`)
  const dataBySymbol = [];
  for (const {timestamp, amounts} of data.data) {
    for (const {symbol, amount, value_usd} of amounts) {
      dataBySymbol.push({timestamp: new Date(timestamp * 1000), symbol, amount, value_usd});
    }
  }

  await prisma.crypto_whale_alerts.createMany({
    data: dataBySymbol,
    skipDuplicates: true,
  });
}

async function syncBinanceSymbolsData(symbol: string) {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;
  const binance = new Spot(apiKey, apiSecret);

  const klines = await binance.uiklines(symbol, Interval['5m'], {limit: 1000, endTime: Date.now()});
  await prisma.crypto_symbol_data.createMany({
    data: klines.map(([timestamp, openPrice, high, low, closePrice, volume, quoteAssetVolume, trades]) => ({
      symbol,
      timestamp: new Date(timestamp),
      openPrice: String(openPrice),
      high: String(high),
      low: String(low),
      closePrice: String(closePrice),
      volume: String(volume),
      quoteAssetVolume: String(quoteAssetVolume),
      trades: String(trades),
    })),
    skipDuplicates: true,
  });

}

async function syncCryptoDataJob() {
  const logger = serverLogger.to('syncCryptoDataJob');
  try {
    await syncGlobalMetricsRequest();
  } catch (error) {
    logger.error('Error fetching global metrics:', error);
  }

  try {
    await syncMetadata();
  } catch (error) {
    logger.error('Error fetching metadata:', error);
  }

  try {
    await syncWhaleAlerts();
  } catch (error) {
    logger.error('Error fetching whale alerts:', error);
  }

  try {
    await syncBinanceSymbolsData('BTCUSDT');
  } catch (error) {
    logger.error('Error syncing BTCUSDT data:', error);
  }

  try {
    await syncBinanceSymbolsData('ETHUSDT');
  } catch (error) {
    logger.error('Error syncing ETHUSDT data:', error);
  }
}

export default syncCryptoDataJob;
