import 'dotenv/config';
import express, { Request, Response } from 'express';
<<<<<<< HEAD
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from './utils/auth';

// Load environment variables from .env file
dotenv.config();

const app = express();
const prisma = new PrismaClient();
=======
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User as SharedUser } from 'shared-types';

// Extend the shared User type to include the password for internal use
type User = SharedUser & {
  password?: string;
};

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

>>>>>>> origin/fix-lint-setup
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'a-default-secret-key';

// In-memory database for demonstration
const users: User[] = [];

app.use(bodyParser.json());

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

app.get('/', (req: Request, res: Response) => {
  res.send('Auth service is running!');
});

<<<<<<< HEAD
// Register a new user
app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: 'User with this email already exists' });
  }
});

// Login a user
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const accessToken = generateToken(user.id);
  res.json({ accessToken });
});

// Get current user's profile
app.get('/me', authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });
  res.json(user);
});


app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
=======
app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  // Don't send the password back, even the hash
  res.status(201).json({ message: 'User registered successfully' });
>>>>>>> origin/fix-lint-setup
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(user => user.email === email);
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});


// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Auth service listening at http://localhost:${port}`);
  });
}

export default app;
