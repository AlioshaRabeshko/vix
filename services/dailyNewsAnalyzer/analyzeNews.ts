import ChatGptClient from 'common/chatGpt/ChatGptClient';
import serverLogger from 'common/logger/serverLogger';
import NewsApiClient from 'common/newsApi/NewsApiClient';

async function analyzeNews(startDate: string, endDate: string, type: string) {
  const newsApi = new NewsApiClient();
  const chatGPTClient = new ChatGptClient();

  const articles = await newsApi.getNews(startDate, endDate, type);

  if (articles.length === 0) {
    serverLogger.to('analyzeNews').info('No articles found for the given date range and type.');
    return;
  }

  const articlesText = articles
    .slice(0, 50)
    .map(({title, description}) => `Title: ${title}. Description: ${description}`)
    .join('\n');

  return await chatGPTClient.analyzeNews(articlesText);
}

export default analyzeNews;
