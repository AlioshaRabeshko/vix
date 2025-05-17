import serverLogger from 'common/logger/serverLogger';
import prisma from 'common/prisma/prisma';
import WebSocket from 'ws';

function getTodayPutCallRatio() {
  return new Promise<number>((resolve, reject) => {
    const socket = new WebSocket('wss://data.tradingview.com/socket.io/websocket', {
      origin: 'https://www.tradingview.com',
    });

    socket.on('open', () => {
      const getSession = () => 'cs_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      const chartSession = getSession();
      const quoteSession = getSession();

      function send(message: string) {
        socket.send(`~m~${message.length}~m~${message}`);
      }

      send(JSON.stringify({
        m: 'set_auth_token',
        p: ['unauthorized_user_token'],
      }));

      send(JSON.stringify({
        m: 'chart_create_session',
        p: [chartSession, ''],
      }));

      send(JSON.stringify({
        m: 'quote_create_session',
        p: [quoteSession],
      }));

      send(JSON.stringify({
        m: 'quote_add_symbols',
        p: [quoteSession, '={"adjustment":"splits","symbol":"INDEX:CPC"}'],
      }));
    });

    socket.on('message', (data) => {
      const str = data.toString();

      const messages = str.split('~m~').filter((x) => x && !/^\d+$/.test(x));
      for (const message of messages) {
        try {
          const parsed = JSON.parse(message);

          if (parsed.m === 'qsd' && parsed.p[1].v.lp) {
            socket.close();
            resolve(parsed.p[1].v.lp);
          }
        } catch (err) {
          serverLogger.to('putCallRatioSyncJob').error('Failed to parse message:', err);
        }
      }
    });
    socket.on('error', (error) => {
      socket.close();
      reject(error);
    });
  });
}

async function putCallRatioSyncJob() {
  const putCallRatio = await getTodayPutCallRatio();
  await prisma.put_call_ratio.create({
    data: {value: putCallRatio},
  });
}

export default putCallRatioSyncJob;