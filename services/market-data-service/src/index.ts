import 'dotenv/config';
import express, { Request, Response } from 'express';
<<<<<<< HEAD
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
=======
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { mockStockData } from './mock-data';
>>>>>>> origin/feat/integrate-shadcn-ui

const app = express();
const port = process.env.PORT || 3002;

<<<<<<< HEAD
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

=======
// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Routes
>>>>>>> origin/feat/integrate-shadcn-ui
app.get('/', (req: Request, res: Response) => {
  res.send('Market data service is running!');
});

<<<<<<< HEAD
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
=======
app.get('/stocks', (req: Request, res: Response) => {
  res.json(mockStockData);
>>>>>>> origin/feat/integrate-shadcn-ui
});

app.get('/stocks/:ticker', (req: Request, res: Response) => {
  const { ticker } = req.params;
  const stock = mockStockData.find(
    (s) => s.ticker.toLowerCase() === ticker.toLowerCase()
  );

  if (stock) {
    res.json(stock);
  } else {
    res.status(404).json({ message: `Stock with ticker ${ticker} not found.` });
  }
});

// WebSocket logic
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast updated prices every 2 seconds
const priceUpdateInterval = setInterval(() => {
  mockStockData.forEach(stock => {
    const priceChange = (Math.random() - 0.5) * 2; // -1 to +1 change
    const newPrice = stock.historicalData[stock.historicalData.length - 1].price + priceChange;
    stock.historicalData.push({ date: new Date().toISOString(), price: newPrice });
    if (stock.historicalData.length > 20) {
      stock.historicalData.shift(); // Keep the history from getting too long
    }
  });

  const updatedPrices = mockStockData.map(stock => ({
    ticker: stock.ticker,
    price: stock.historicalData[stock.historicalData.length - 1].price,
  }));

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'prices', data: updatedPrices }));
    }
  });
}, 2000);


server.listen(port, () => {
  console.log(`Market data service with WebSocket listening at http://localhost:${port}`);
});

export { app, server, priceUpdateInterval };
