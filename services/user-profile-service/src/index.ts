import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3003;

app.get('/', (req: Request, res: Response) => {
  res.send('User profile service is running!');
});

app.listen(port, () => {
  console.log(`User profile service listening at http://localhost:${port}`);
});
