import request from 'supertest';
import app from './index';
import { comparePassword } from 'auth-utils';
import { mockUserCreate, mockUserFindUnique } from './__mocks__/prisma-client';
import http from 'http';

jest.setTimeout(30000);
jest.mock('.prisma/client-auth');
jest.mock('auth-utils', () => ({
  ...jest.requireActual('auth-utils'),
  comparePassword: jest.fn(),
  hashPassword: jest.fn().mockResolvedValue('hashedpassword'),
  generateToken: jest.fn().mockReturnValue('test-token'),
}));

describe('Auth Service', () => {
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(4001, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      mockUserCreate.mockResolvedValue({ id: 1, email: 'test@example.com' });

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return 400 if user already exists', async () => {
        mockUserCreate.mockRejectedValue(new Error('User already exists'));

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'User with this email already exists' });
    });
  });

  describe('POST /login', () => {
    it('should login an existing user and return a token', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      mockUserFindUnique.mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should return 400 for invalid credentials (wrong password)', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      mockUserFindUnique.mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return 400 for non-existent user', async () => {
        mockUserFindUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/login')
        .send({ email: 'nouser@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });
  });
});
