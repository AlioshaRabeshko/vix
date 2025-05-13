// eslint-disable-next-line @typescript-eslint/no-require-imports
const NewsAPI = require('newsapi');

class NewsApiClient extends NewsAPI {
  constructor() {
    super(process.env.NEWS_API_KEY);
  }

  async getNews(startDate: string, endDate: string, query: string) {
    const response = await this.v2.everything({
      q: query,
      from: startDate,
      to: endDate,
      language: 'en',
      sortBy: 'relevancy'
    });

    if (!response.articles || response.articles.length === 0) {
      console.info('No articles found for the given date range and query.');
      return [];
    }

    return response.articles;
  }
}

export default NewsApiClient;
