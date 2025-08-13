import express, { Request, Response } from 'express';
import cors from 'cors';
import { mockStockData } from './mock-data';

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Market data service is running!');
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

app.listen(port, () => {
  console.log(`Market data service listening at http://localhost:${port}`);
});
