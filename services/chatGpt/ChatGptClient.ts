import OpenAI from "openai";

class ChatGptClient extends OpenAI {
  constructor() {
    super({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async analyzeNews(articles: string) {
    const response = await this.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'You are analyzing news titles and descriptions about the stock market, economy, business. Please estimate the overall fear/greed index of these news at a scale of 1 to 10, name the field "rating". (1 is greed, 10 is absolute panic). And overall summary of these news (within 50 words), name the field "summary". Format response in JSON without markdown.',
      input: articles
    });

    return response.output_text;
  }
}

export default ChatGptClient;
