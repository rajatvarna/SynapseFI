import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'auth-utils';
import { User } from 'shared-types';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = verifyToken(token);
    req.user = user as User;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
