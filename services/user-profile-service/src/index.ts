import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client-user-profile';
import cors from 'cors';
import { authenticateToken } from 'auth-middleware';
import { User } from 'shared-types';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3003;

interface AuthenticatedRequest extends Request {
  user?: User;
}

app.use(cors());
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`User profile service listening at http://localhost:${port}`);
});
