import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { mockStockData } from './mock-data';

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Market data service is running!');
});

app.get('/stocks', (req: Request, res: Response) => {
  res.json(mockStockData);
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
setInterval(() => {
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
