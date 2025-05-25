import prisma from 'common/prisma/prisma';
import {getWeekFearIndex, getMonthFearIndex} from './getFearIndex';

async function updateFearIndexJob() {
  const indexWeekly = await getWeekFearIndex();
  await prisma.vix_weekly.create({
    data: {
      value: indexWeekly,
    },
  });

  const indexMonthly = await getMonthFearIndex();
  await prisma.vix_monthly.create({
    data: {
      value: indexMonthly,
    },
  });
}

export default updateFearIndexJob;
