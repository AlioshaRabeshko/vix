import ChatGptClient from 'services/chatGpt/ChatGptClient';
import NewsApiClient from 'services/newsApi/NewsApiClient';

async function analyzeDailyNews(startDate, endDate, type) {
  const newsApi = new NewsApiClient();
  const chatGPTClient = new ChatGptClient();

  const articles = await newsApi.getNews(startDate, endDate, type);//, 'NASDAQ, S&P 500');

  if (articles.length === 0) {
    return;
  }

  const articlesText = articles
    .slice(0, 50)
    .map(({title, description}) => `Title: ${title}. Description: ${description}`)
    .join('\n');

  const analysis = await chatGPTClient.analyzeNews(articlesText);
  return JSON.parse(analysis);
}

export default analyzeDailyNews;
