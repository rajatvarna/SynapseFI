import request from 'supertest';
import app from './index';

describe('User Profile Service', () => {
  it('should return a 200 OK for the root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('User profile service is running!');
  });
});
