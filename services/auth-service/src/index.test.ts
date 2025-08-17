import request from 'supertest';
import app from './index';
import { PrismaClient } from '@prisma/client';
import { comparePassword } from './utils/auth';

jest.mock('./utils/auth', () => ({
  ...jest.requireActual('./utils/auth'),
  comparePassword: jest.fn(),
}));

const prisma = new PrismaClient();

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      });

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return 400 if user already exists', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValueOnce(new Error());

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'User with this email already exists' });
    });
  });

  describe('POST /login', () => {
    it('should login an existing user and return a token', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should return 400 for invalid credentials (wrong password)', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
            id: 1,
            email: 'test@example.com',
            password: 'hashedpassword',
        });
        (comparePassword as jest.Mock).mockResolvedValueOnce(false);

        const res = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return 400 for non-existent user', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

        const res = await request(app)
            .post('/login')
            .send({ email: 'nouser@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Invalid credentials' });
    });
  });
});
