import 'dotenv/config';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '.prisma/client-auth';
import cors from 'cors';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from 'auth-utils';
import { authenticateToken } from 'auth-middleware';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Auth service is running!');
});

import { validate } from './middleware';
import { registerSchema, loginSchema } from './validation';

app.post('/register', validate(registerSchema), async (request: Request, res: Response) => {
  const { email, password } = request.body;

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

app.post('/login', validate(loginSchema), async (request: Request, res: Response) => {
  const { email, password } = request.body;

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

export default app;
