import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { User } from 'shared-types';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3003;
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
  res.send('User profile service is running!');
});

// Get or create user profile
app.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in token' });
  }

  let profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId,
      },
    });
  }

  res.json(profile);
});

// Update user profile
app.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { firstName, lastName } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in token' });
  }

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        firstName,
        lastName,
      },
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: 'Profile not found' });
  }
});

// Update user profile picture
app.put('/profile/picture', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { profilePictureUrl } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in token' });
  }

  if (!profilePictureUrl) {
    return res.status(400).json({ error: 'profilePictureUrl is required' });
  }

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        profilePictureUrl,
      },
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: 'Profile not found' });
  }
});

// Get user transaction history
app.get('/profile/transactions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in token' });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        transactions: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile.transactions);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching transactions' });
  }
});

// Get user portfolio
app.get('/portfolio', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    let portfolio = await prisma.portfolio.findUnique({
        where: { profileId: profile.id },
        include: { items: true },
    });

    if (!portfolio) {
        portfolio = await prisma.portfolio.create({
            data: {
                profileId: profile.id,
            },
            include: { items: true },
        });
    }

    res.json(portfolio);
});

// Add item to portfolio
app.post('/portfolio/items', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { symbol, quantity } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!symbol || !quantity) {
        return res.status(400).json({ error: 'Symbol and quantity are required' });
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { portfolio: true }
        });
        if (!profile || !profile.portfolio) {
            return res.status(404).json({ error: 'Portfolio not found for this user' });
        }

        const newItem = await prisma.portfolioItem.create({
            data: {
                symbol,
                quantity,
                portfolioId: profile.portfolio.id,
            },
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding item to portfolio' });
    }
});

// Update portfolio item
app.put('/portfolio/items/:itemId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
        return res.status(400).json({ error: 'Quantity is required' });
    }

    try {
        const updatedItem = await prisma.portfolioItem.update({
            where: { id: parseInt(itemId) },
            data: { quantity },
        });
        res.json(updatedItem);
    } catch (error) {
        res.status(404).json({ error: 'Portfolio item not found' });
    }
});

// Delete portfolio item
app.delete('/portfolio/items/:itemId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;

    try {
        await prisma.portfolioItem.delete({
            where: { id: parseInt(itemId) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Portfolio item not found' });
    }
});

// Get user watchlist
app.get('/watchlist', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    let watchlist = await prisma.watchlist.findUnique({
        where: { profileId: profile.id },
        include: { items: true },
    });

    if (!watchlist) {
        watchlist = await prisma.watchlist.create({
            data: {
                profileId: profile.id,
            },
            include: { items: true },
        });
    }

    res.json(watchlist);
});

// Add item to watchlist
app.post('/watchlist/items', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { symbol } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in token' });
    }

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { watchlist: true }
        });
        if (!profile || !profile.watchlist) {
            return res.status(404).json({ error: 'Watchlist not found for this user' });
        }

        const newItem = await prisma.watchlistItem.create({
            data: {
                symbol,
                watchlistId: profile.watchlist.id,
            },
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding item to watchlist' });
    }
});

// Delete watchlist item
app.delete('/watchlist/items/:itemId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;

    try {
        await prisma.watchlistItem.delete({
            where: { id: parseInt(itemId) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Watchlist item not found' });
    }
});

app.listen(port, () => {
  console.log(`User profile service listening at http://localhost:${port}`);
});
