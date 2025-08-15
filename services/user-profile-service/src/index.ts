<<<<<<< HEAD
import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
=======
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { User } from 'shared-types';
>>>>>>> origin/feat/integrate-shadcn-ui

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

<<<<<<< HEAD
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
=======
// Extend the Request type to include the user payload
interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware
app.use(cors());
app.use(express.json());

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user as User;
>>>>>>> origin/feat/integrate-shadcn-ui
    next();
  });
};

<<<<<<< HEAD
=======
// Routes
>>>>>>> origin/feat/integrate-shadcn-ui
app.get('/', (req: Request, res: Response) => {
  res.send('User profile service is running!');
});

<<<<<<< HEAD
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


=======
// This is a protected route
app.get('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  // The user information is attached to the request object by the middleware
  // In a real app, you might fetch more details from a database using the user's ID
  res.json({ user: req.user });
});

>>>>>>> origin/feat/integrate-shadcn-ui
app.listen(port, () => {
  console.log(`User profile service listening at http://localhost:${port}`);
});
