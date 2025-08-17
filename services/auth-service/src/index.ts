import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from './utils/auth';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

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

app.post('/register', async (request: Request, res: Response) => {
  const { email, password } = request.body;

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

app.post('/login', async (request: Request, res: Response) => {
  const { email, password } = request.body;

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

app.get('/me', authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });
  res.json(user);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Auth service listening at http://localhost:${port}`);
  });
}

export default app;
