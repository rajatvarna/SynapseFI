import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { FinnhubWS } from '@stoqey/finnhub';
import { finnhubClient } from './finnhub';

const app = express();
const port = process.env.PORT || 3002;

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

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

if (require.main === module) {
  server.listen(port, async () => {
    if (!FINNHUB_API_KEY) {
      console.error('Finnhub API key is not configured. Please set FINNHUB_API_KEY in .env file.');
      // In a real app, you might want to exit the process if the API key is missing
      // For this example, we will just log the error and continue without real-time data.
      return;
    }

    await initializeStockData();

    try {
      const finnhubWs = new FinnhubWS(FINNHUB_API_KEY);

      finnhubWs.on('onData', (data: any) => {
        if (data.type === 'trade') {
          for (const trade of data.data) {
            const stock = stockData.find(s => s.symbol === trade.s);
            if (stock) {
              stock.price = trade.p;
              stock.timestamp = trade.t;
            }
          }

          const updatedPrices = stockData.map(stock => ({
            ticker: stock.symbol,
            price: stock.price,
          }));

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'prices', data: updatedPrices }));
            }
          });
        }
      });

      finnhubWs.on('onReady', () => {
          popularStocks.forEach(symbol => {
              finnhubWs.addSymbol(symbol);
          });
          console.log('Subscribed to popular stocks for real-time updates.');
      });

      finnhubWs.on('onError', (error) => {
          console.error('Finnhub WebSocket error:', error);
      });

    } catch (error) {
        console.error('Failed to initialize Finnhub WebSocket:', error);
    }

    console.log(`Market data service with WebSocket listening at http://localhost:${port}`);
  });
}

export { app, server, initializeStockData, stockData, finnhubClient };
