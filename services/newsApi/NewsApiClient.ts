const NewsAPI = require('newsapi');

class NewsApiClient extends NewsAPI {
  constructor() {
    super(process.env.NEWS_API_KEY);
  }

  async getNews(dateStart, dateEnd, query) {
    const response = await this.v2.everything({
      q: 'stock market, economy',
      from: dateStart,
      to: dateEnd,
      language: 'en',
      sortBy: 'relevancy'
    });

    return response.articles;
  }
}

export default NewsApiClient;
