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

// --- Placeholder functions for inter-service communication ---

async function getUserBalance(userId: number): Promise<number> {
    // In a real implementation, this would call the user-profile-service
    // For now, we'll return a mock balance.
    console.log(`Fetching balance for user ${userId}...`);
    return 10000;
}

async function updateUserBalance(userId: number, newBalance: number): Promise<void> {
    // In a real implementation, this would call the user-profile-service
    console.log(`Updating balance for user ${userId} to ${newBalance}...`);
}

async function getStockPrice(symbol: string): Promise<number> {
    // In a real implementation, this would call the market-data-service
    console.log(`Fetching price for ${symbol}...`);
    return 150; // Mock price
}

async function updateUserPortfolio(userId: number, symbol: string, quantity: number): Promise<void> {
    // In a real implementation, this would call the user-profile-service
    console.log(`Updating portfolio for user ${userId}: ${quantity} of ${symbol}...`);
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
    const { symbol, quantity } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
    }

    try {
        const price = await getStockPrice(symbol);
        const totalCost = price * quantity;
        const balance = await getUserBalance(parseInt(userId));

        if (balance < totalCost) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const trade = await prisma.trade.create({
            data: {
                userId: parseInt(userId),
                symbol,
                quantity,
                price,
                type: 'BUY',
            },
        });

        await updateUserBalance(parseInt(userId), balance - totalCost);
        await updateUserPortfolio(parseInt(userId), symbol, quantity);

        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the trade' });
    }
});

// Sell a stock
app.post('/sell', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { symbol, quantity } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
    }

    try {
        // In a real app, we should also check if the user owns enough stock to sell.
        // This would require a call to the user-profile-service.
        // For now, we will assume the user has enough stock.

        const price = await getStockPrice(symbol);
        const totalCredit = price * quantity;
        const balance = await getUserBalance(parseInt(userId));

        const trade = await prisma.trade.create({
            data: {
                userId: parseInt(userId),
                symbol,
                quantity,
                price,
                type: 'SELL',
            },
        });

        await updateUserBalance(parseInt(userId), balance + totalCredit);
        await updateUserPortfolio(parseInt(userId), symbol, -quantity);

        res.status(201).json(trade);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the trade' });
    }
});


app.listen(port, () => {
  console.log(`Trading service listening at http://localhost:${port}`);
});

export default app;
