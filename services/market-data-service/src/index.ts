import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

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

const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
const stockData: StockData[] = [];

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

const initializeStockData = async () => {
  if (!FINNHUB_API_KEY) {
    console.error('Finnhub API key is not configured');
    return;
  }
  for (const symbol of popularStocks) {
    const data = await fetchStockPrice(symbol);
    if (data) {
      stockData.push(data);
    }
  }
};

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get('/', (req: Request, res: Response) => {
  res.send('Market data service is running!');
});

app.get('/stocks', (req:Request, res: Response) => {
  res.json(stockData);
});

app.get('/stocks/:ticker', (req: Request, res: Response) => {
  const { ticker } = req.params;
  const stock = stockData.find(
    (s) => s.symbol.toLowerCase() === ticker.toLowerCase()
  );

  if (stock) {
    res.json(stock);
  } else {
    res.status(404).json({ message: `Stock with ticker ${ticker} not found.` });
  }
});

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const priceUpdateInterval = setInterval(() => {
  stockData.forEach(stock => {
    const priceChange = (Math.random() - 0.5) * 2; // -1 to +1 change
    stock.price += priceChange;
  });

  const updatedPrices = stockData.map(stock => ({
    ticker: stock.symbol,
    price: stock.price,
  }));

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'prices', data: updatedPrices }));
    }
  });
}, 2000);

server.listen(port, async () => {
  await initializeStockData();
  console.log(`Market data service with WebSocket listening at http://localhost:${port}`);
});

export { app, server, priceUpdateInterval };
