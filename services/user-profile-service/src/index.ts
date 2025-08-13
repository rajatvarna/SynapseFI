import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  // Note: The JWT_SECRET must be the same as the one used in the auth-service
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

app.get('/', (req: Request, res: Response) => {
  res.send('User profile service is running!');
});

// Get or create user profile
app.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

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
app.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { firstName, lastName } = req.body;

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
