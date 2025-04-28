import ChatGptClient from 'common/chatGpt/ChatGptClient';
import NewsApiClient from 'common/newsApi/NewsApiClient';

async function analyzeNews(startDate, endDate, type) {
  const newsApi = new NewsApiClient();
  const chatGPTClient = new ChatGptClient();

  const articles = await newsApi.getNews(startDate, endDate, type);

  if (articles.length === 0) {
    console.info('No articles found for the given date range and type.');
    return;
  }

  const articlesText = articles
    .slice(0, 50)
    .map(({title, description}) => `Title: ${title}. Description: ${description}`)
    .join('\n');

  return await chatGPTClient.analyzeNews(articlesText);
}

export default analyzeNews;
