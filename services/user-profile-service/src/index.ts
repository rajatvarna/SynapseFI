import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { User } from 'shared-types';

const app = express();
const port = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

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
    next();
  });
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('User profile service is running!');
});

// This is a protected route
app.get('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  // The user information is attached to the request object by the middleware
  // In a real app, you might fetch more details from a database using the user's ID
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`User profile service listening at http://localhost:${port}`);
});
