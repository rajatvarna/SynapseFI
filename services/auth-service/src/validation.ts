import { z } from 'zod';
import { Role } from '.prisma/client-auth';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});
