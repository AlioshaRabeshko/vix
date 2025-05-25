import axios from 'axios';
import {omit} from 'lodash';
import prisma from 'common/prisma/prisma';

async function cnnDataSyncJob() {
  const {data} = await axios.get('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
  });

  const records = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  for (const [keyword, {data: chartData}] of Object.entries(omit(data, 'fear_and_greed'))) {
    for (const {x, y: value, rating} of chartData) {
      records.push({
        date: new Date(x),
        keyword,
        value,
        rating
      });
    }
  }

  await prisma.cnn_data.createMany({
    data: records,
    skipDuplicates: true
  })
}

export default cnnDataSyncJob;
