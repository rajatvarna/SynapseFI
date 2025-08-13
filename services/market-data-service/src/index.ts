import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const finnhubClient = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: FINNHUB_API_KEY,
  },
});

interface StockData {
  symbol: string;
  price: number;
  timestamp: number;
}

// In-memory cache
const cache = new Map<string, StockData>();
const CACHE_TTL = 60 * 1000; // 1 minute

const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

const fetchStockPrice = async (symbol: string): Promise<StockData | null> => {
  try {
    const response = await finnhubClient.get('/quote', { params: { symbol } });
    if (response.data && response.data.c) {
      return {
        symbol,
        price: response.data.c,
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
};

app.get('/', (req: Request, res: Response) => {
  res.send('Market data service is running!');
});

app.get('/stocks', async (req: Request, res: Response) => {
  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: 'Finnhub API key is not configured' });
  }

  try {
    const results: StockData[] = [];
    for (const symbol of popularStocks) {
      const cachedData = cache.get(symbol);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
        results.push(cachedData);
      } else {
        const newData = await fetchStockPrice(symbol);
        if (newData) {
          cache.set(symbol, newData);
          results.push(newData);
        }
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

app.listen(port, () => {
  console.log(`Market data service listening at http://localhost:${port}`);
});
