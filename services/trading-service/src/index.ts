import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { User } from 'shared-types';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3005;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

interface AuthenticatedRequest extends Request {
  user?: User;
}

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user as User;
    next();
  });
};

app.get('/', (req: Request, res: Response) => {
  res.send('Trading service is running!');
});

// Buy a stock
app.post('/buy', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { symbol, quantity, price } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!symbol || !quantity || !price) {
        return res.status(400).json({ error: 'Symbol, quantity, and price are required' });
    }

    try {
        const trade = await prisma.trade.create({
            data: {
                userId: parseInt(userId),
                symbol,
                quantity,
                price,
                type: 'BUY',
            },
        });
        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the trade' });
    }
});

// Sell a stock
app.post('/sell', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { symbol, quantity, price } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!symbol || !quantity || !price) {
        return res.status(400).json({ error: 'Symbol, quantity, and price are required' });
    }

    try {
        const trade = await prisma.trade.create({
            data: {
                userId: parseInt(userId),
                symbol,
                quantity,
                price,
                type: 'SELL',
            },
        });
        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the trade' });
    }
});


app.listen(port, () => {
  console.log(`Trading service listening at http://localhost:${port}`);
});

export default app;
