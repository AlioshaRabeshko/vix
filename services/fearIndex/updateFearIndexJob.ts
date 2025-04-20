import prisma from 'services/prisma/prisma';
import getFearIndex from './getFearIndex';

async function updateFearIndexJob() {
  const index = await getFearIndex();
  await prisma.vix.create({
    data: {
      value: index,
    },
  });
}

export default updateFearIndexJob;
