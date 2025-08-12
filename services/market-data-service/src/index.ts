import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3002;

app.get('/', (req: Request, res: Response) => {
  res.send('Market data service is running!');
});

app.listen(port, () => {
  console.log(`Market data service listening at http://localhost:${port}`);
});
