# VIX Fear Index Tracker
This project is a comprehensive system for tracking and analyzing the VIX Fear Index, which measures market volatility and sentiment. It integrates data from multiple sources, including Google Trends, stock market data, news sentiment analysis, and put-call ratios, to calculate a composite fear index.

## Features

- **Google Trends Analysis**: Tracks interest over time for specific financial keywords.
- **Stock Data Synchronization**: Fetches and stores ETF and stock market data, including price and P/E ratios.
- **News Sentiment Analysis**: Uses OpenAI's GPT model to analyze news articles and derive a fear/greed rating.
- **Put-Call Ratio Tracking**: Fetches real-time put-call ratio data from TradingView.
- **Fear Index Calculation**: Combines multiple data points to calculate a normalized fear index.
- **Scheduled Jobs**: Automates data collection and analysis using cron jobs.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **TypeScript**: Strongly typed programming language for better code quality.
- **Prisma**: ORM for database management.
- **MySQL**: Relational database for storing data.
- **Google Trends API**: For tracking keyword trends.
- **Yahoo Finance API**: For fetching stock and ETF data.
- **OpenAI GPT**: For analyzing news sentiment.
- **TradingView WebSocket**: For real-time put-call ratio data.
- **Cron**: For scheduling periodic tasks.

## Data Flow

1. **Google Trends Job**: Fetches keyword trends and stores them in the database.
2. **Stock Data Sync Job**: Retrieves stock and ETF data and stores it in the database.
3. **Daily News Analyzer Job**: Analyzes news articles for sentiment and stores the results.
4. **Put-Call Ratio Sync Job**: Fetches the latest put-call ratio and stores it.
5. **Fear Index Calculation**: Combines all data points to calculate the fear index.
6. **Update Fear Index Job**: Stores the calculated fear index in the database.

## Database Schema

The project uses a MySQL database with the following key models:

- `daily_news_analysis`: Stores news sentiment ratings and summaries.
- `stock_data`: Stores stock and ETF data, including price and P/E ratios.
- `put_call_ratio`: Stores the daily put-call ratio.
- `google_trends`: Stores Google Trends data for financial keywords.
- `vix`: Stores the calculated fear index.

## Setup Instructions

1. **Clone the repository**:
  ```bash
  git clone https://github.com/AlioshaRabeshko/vix.git
  cd vix
  ```

2. **Set up environment variables for the database**:
  Create or update the `.env` file with the following database configuration:
  ```plaintext
  MYSQL_ROOT_PASSWORD=password
  MYSQL_DATABASE=vix
  MYSQL_USER=user
  MYSQL_PASSWORD=password
  MYSQL_HOST=127.0.0.1
  DATABASE_URL="mysql://root:password@127.0.0.1:3306/vix"
  ```

3. **Set up the database using Docker**:
  Ensure you have Docker installed and running on your system. Then, start the MySQL container:
  ```bash
  docker-compose up -d
  ```

4. **Install dependencies**:
  ```bash
  yarn
  ```

5. **Set up additional environment variables**:
  Add the following keys to the `.env` file:
  ```plaintext
  OPENAI_API_KEY=your_openai_api_key
  NEWS_API_KEY=your_newsapi_key
  ```

6. **Run database migrations**:
  ```bash
  npx prisma generate
  npx prisma migrate dev
  ```

7. **Start the application**:
  ```bash
  yarn start
  ```

## Cron Jobs

The application uses `node-cron` to schedule tasks:
- Google Trends Job: Runs daily at 2 AM and 6 PM.
- Put-Call Ratio Sync Job: Runs daily at 10 AM, 12 PM, 4 PM, and 11 PM.
- Daily News Analyzer Job: Runs daily at 12 PM, 4 PM, and 11 PM.
- Stock Data Sync Job: Runs every 20 minutes.
- Update Fear Index Job: Runs every 20 minutes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any questions or support, please contact [Leflylll@gmail.com].
