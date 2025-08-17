import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Mock PrismaClient
const mockTradeCreate = jest.fn();
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    trade: {
      create: mockTradeCreate,
    },
  })),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Import app after mocks
import app from './index';

describe('Trading Service', () => {
  const token = 'test-token';
  const user = { id: '1', name: 'Test User' };

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, user);
    });
  });

  describe('POST /buy', () => {
    it('should create a buy trade successfully', async () => {
      const tradeData = { id: 1, userId: 1, symbol: 'AAPL', quantity: 10, price: 150, type: 'BUY' };
      mockTradeCreate.mockResolvedValue(tradeData);

      const res = await request(app)
        .post('/buy')
        .set('Authorization', `Bearer ${token}`)
        .send({ symbol: 'AAPL', quantity: 10, price: 150 });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(tradeData);
      expect(mockTradeCreate).toHaveBeenCalledWith({
        data: {
          userId: 1,
          symbol: 'AAPL',
          quantity: 10,
          price: 150,
          type: 'BUY',
        },
      });
    });
  });

  describe('POST /sell', () => {
    it('should create a sell trade successfully', async () => {
      const tradeData = { id: 2, userId: 1, symbol: 'AAPL', quantity: 5, price: 155, type: 'SELL' };
      mockTradeCreate.mockResolvedValue(tradeData);

      const res = await request(app)
        .post('/sell')
        .set('Authorization', `Bearer ${token}`)
        .send({ symbol: 'AAPL', quantity: 5, price: 155 });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(tradeData);
      expect(mockTradeCreate).toHaveBeenCalledWith({
        data: {
          userId: 1,
          symbol: 'AAPL',
          quantity: 5,
          price: 155,
          type: 'SELL',
        },
      });
    });
  });
});
