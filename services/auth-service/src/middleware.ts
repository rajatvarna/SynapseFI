import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import { PrismaClient } from '.prisma/client-auth';

const prisma = new PrismaClient();

export const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.errors.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkRole = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};
