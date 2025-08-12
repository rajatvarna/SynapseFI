import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Auth service is running!');
});

app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});
