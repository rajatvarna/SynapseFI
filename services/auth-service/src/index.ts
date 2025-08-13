import 'dotenv/config';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User as SharedUser } from 'shared-types';

// Extend the shared User type to include the password for internal use
type User = SharedUser & {
  password?: string;
};

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'a-default-secret-key';

// In-memory database for demonstration
const users: User[] = [];

app.get('/', (req: Request, res: Response) => {
  res.send('Auth service is running!');
});

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
