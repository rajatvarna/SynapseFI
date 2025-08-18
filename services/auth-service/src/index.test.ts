import request from 'supertest';
import app from './index';
import { comparePassword } from 'auth-utils';
import { mockUserCreate, mockUserFindUnique, mockUserUpdate } from './__mocks__/prisma-client';
import http from 'http';
import { Role } from '.prisma/client-auth';

jest.setTimeout(30000);
jest.mock('.prisma/client-auth');
jest.mock('auth-utils', () => ({
  ...jest.requireActual('auth-utils'),
  comparePassword: jest.fn(),
  hashPassword: jest.fn().mockResolvedValue('hashedpassword'),
  generateToken: jest.fn().mockReturnValue('test-token'),
}));

describe('Auth Service', () => {
  console.log('Auth Service tests started');
  let server: http.Server;

  beforeAll((done) => {
    console.log('beforeAll started');
    server = app.listen(4001, done);
    console.log('beforeAll finished');
  });

  afterAll((done) => {
    console.log('afterAll started');
    server.close(done);
    console.log('afterAll finished');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    console.log('POST /register tests started');
    it('should register a new user successfully', async () => {
      console.log('should register a new user successfully test started');
      mockUserCreate.mockResolvedValue({ id: 1, email: 'test@example.com' });

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return 400 if user already exists', async () => {
        console.log('should return 400 if user already exists test started');
        mockUserCreate.mockRejectedValue(new Error('User already exists'));

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'User with this email already exists' });
    });

    it('should return 400 for invalid email', async () => {
      console.log('should return 400 for invalid email test started');
      const res = await request(app)
        .post('/register')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 for short password', async () => {
      console.log('should return 400 for short password test started');
      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: '123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /login', () => {
    console.log('POST /login tests started');
    it('should login an existing user and return a token', async () => {
      console.log('should login an existing user and return a token test started');
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
      console.log('should return 400 for invalid credentials (wrong password) test started');
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
        console.log('should return 400 for non-existent user test started');
        mockUserFindUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/login')
        .send({ email: 'nouser@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('GET /admin/users', () => {
    it('should return 403 for non-admin user', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', role: 'USER' };
      mockUserFindUnique.mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const loginRes = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      const res = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it('should return 200 for admin user', async () => {
        const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', role: 'ADMIN' };
        mockUserFindUnique.mockResolvedValue(user);
        (comparePassword as jest.Mock).mockResolvedValue(true);

        const loginRes = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        const res = await request(app)
            .get('/admin/users')
            .set('Authorization', `Bearer ${loginRes.body.accessToken}`);

        expect(res.statusCode).toEqual(200);
    });
  });

  describe('PUT /admin/users/:id/role', () => {
    it('should allow an admin to update a user role', async () => {
      const admin = { id: 1, email: 'admin@example.com', password: 'hashedpassword', role: Role.ADMIN };
      const userToUpdate = { id: 2, email: 'user@example.com', password: 'hashedpassword', role: Role.USER };
      mockUserFindUnique.mockResolvedValueOnce(admin);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockUserUpdate.mockResolvedValue({ ...userToUpdate, role: Role.ADMIN });

      const loginRes = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'password123' });

      const res = await request(app)
        .put('/admin/users/2/role')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({ role: Role.ADMIN });

      expect(res.statusCode).toEqual(200);
      expect(res.body.role).toEqual(Role.ADMIN);
    });

    it('should forbid a non-admin from updating a user role', async () => {
      const nonAdmin = { id: 1, email: 'user@example.com', password: 'hashedpassword', role: Role.USER };
      mockUserFindUnique.mockResolvedValueOnce(nonAdmin);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const loginRes = await request(app)
        .post('/login')
        .send({ email: 'user@example.com', password: 'password123' });

      const res = await request(app)
        .put('/admin/users/2/role')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({ role: Role.ADMIN });

      expect(res.statusCode).toEqual(403);
    });

    it('should return 400 for an invalid role', async () => {
      const admin = { id: 1, email: 'admin@example.com', password: 'hashedpassword', role: Role.ADMIN };
      mockUserFindUnique.mockResolvedValueOnce(admin);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const loginRes = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'password123' });

      const res = await request(app)
        .put('/admin/users/2/role')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({ role: 'INVALID_ROLE' });

      expect(res.statusCode).toEqual(400);
    });

    it('should return 400 if the user to update does not exist', async () => {
      const admin = { id: 1, email: 'admin@example.com', password: 'hashedpassword', role: Role.ADMIN };
      mockUserFindUnique.mockResolvedValueOnce(admin);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockUserUpdate.mockRejectedValue(new Error('User not found'));

      const loginRes = await request(app)
        .post('/login')
        .send({ email: 'admin@example.com', password: 'password123' });

      const res = await request(app)
        .put('/admin/users/999/role')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .send({ role: Role.ADMIN });

      expect(res.statusCode).toEqual(400);
    });
  });
});
