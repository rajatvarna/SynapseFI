import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from './db';
import { User } from 'shared-types';

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Auth service is running!');
});

app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    passwordHash,
  };

  users.push(newUser);

  console.log('Registered new user:', { id: newUser.id, name: newUser.name, email: newUser.email });
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const userPayload: Omit<User, 'passwordHash'> = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, user: userPayload });
});


app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});
