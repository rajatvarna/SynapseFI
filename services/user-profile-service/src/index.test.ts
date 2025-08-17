import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Mock PrismaClient
const mockProfileFindUnique = jest.fn();
const mockProfileCreate = jest.fn();
const mockProfileUpdate = jest.fn();
const mockPortfolioFindUnique = jest.fn();
const mockPortfolioCreate = jest.fn();
const mockPortfolioItemCreate = jest.fn();
const mockPortfolioItemUpdate = jest.fn();
const mockPortfolioItemDelete = jest.fn();
const mockWatchlistFindUnique = jest.fn();
const mockWatchlistCreate = jest.fn();
const mockWatchlistItemCreate = jest.fn();
const mockWatchlistItemDelete = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    profile: {
      findUnique: mockProfileFindUnique,
      create: mockProfileCreate,
      update: mockProfileUpdate,
    },
    portfolio: {
        findUnique: mockPortfolioFindUnique,
        create: mockPortfolioCreate,
    },
    portfolioItem: {
        create: mockPortfolioItemCreate,
        update: mockPortfolioItemUpdate,
        delete: mockPortfolioItemDelete,
    },
    watchlist: {
        findUnique: mockWatchlistFindUnique,
        create: mockWatchlistCreate,
    },
    watchlistItem: {
        create: mockWatchlistItemCreate,
        delete: mockWatchlistItemDelete,
    },
  })),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Import app after mocks
import app from './index';

describe('User Profile Service', () => {
  const token = 'test-token';
  const user = { id: '1' };

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, user);
    });
  });

  describe('GET /profile', () => {
    it('should get a user profile successfully', async () => {
      const profileData = { id: 1, userId: 1, firstName: 'Test', lastName: 'User' };
      mockProfileFindUnique.mockResolvedValue(profileData);

      const res = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(profileData);
    });

    it('should create a user profile if one does not exist', async () => {
        mockProfileFindUnique.mockResolvedValue(null);
        const profileData = { id: 1, userId: 1, firstName: null, lastName: null };
        mockProfileCreate.mockResolvedValue(profileData);

        const res = await request(app)
          .get('/profile')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(profileData);
      });
  });

  describe('PUT /profile', () => {
    it('should update a user profile successfully', async () => {
      const updatedProfileData = { id: 1, userId: 1, firstName: 'Updated', lastName: 'User' };
      mockProfileUpdate.mockResolvedValue(updatedProfileData);

      const res = await request(app)
        .put('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated', lastName: 'User' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(updatedProfileData);
    });
  });

  describe('PUT /profile/picture', () => {
    it('should update a user profile picture successfully', async () => {
      const updatedProfileData = { id: 1, userId: 1, profilePictureUrl: 'new-url' };
      mockProfileUpdate.mockResolvedValue(updatedProfileData);

      const res = await request(app)
        .put('/profile/picture')
        .set('Authorization', `Bearer ${token}`)
        .send({ profilePictureUrl: 'new-url' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(updatedProfileData);
    });
  });

  describe('GET /profile/transactions', () => {
    it('should get user transactions successfully', async () => {
      const transactionsData = [{ id: 1, type: 'BUY', amount: 100, date: new Date() }];
      mockProfileFindUnique.mockResolvedValue({ transactions: transactionsData });

      const res = await request(app)
        .get('/profile/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(transactionsData.map(tx => ({...tx, date: tx.date.toISOString()})));
    });
  });

  describe('GET /portfolio', () => {
    it('should get user portfolio successfully', async () => {
        const portfolioData = { id: 1, profileId: 1, items: [] };
        mockProfileFindUnique.mockResolvedValue({ id: 1 });
        mockPortfolioFindUnique.mockResolvedValue(portfolioData);

        const res = await request(app)
          .get('/portfolio')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(portfolioData);
      });
  });

  describe('POST /portfolio/items', () => {
    it('should add an item to the portfolio successfully', async () => {
        const portfolioItemData = { id: 1, symbol: 'AAPL', quantity: 10, portfolioId: 1 };
        mockProfileFindUnique.mockResolvedValue({ id: 1, portfolio: { id: 1 } });
        mockPortfolioItemCreate.mockResolvedValue(portfolioItemData);

        const res = await request(app)
            .post('/portfolio/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ symbol: 'AAPL', quantity: 10 });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(portfolioItemData);
    });
  });

  describe('PUT /portfolio/items/:itemId', () => {
    it('should update a portfolio item successfully', async () => {
        const updatedItemData = { id: 1, symbol: 'AAPL', quantity: 20, portfolioId: 1 };
        mockPortfolioItemUpdate.mockResolvedValue(updatedItemData);

        const res = await request(app)
            .put('/portfolio/items/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 20 });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedItemData);
    });
  });

  describe('DELETE /portfolio/items/:itemId', () => {
    it('should delete a portfolio item successfully', async () => {
        mockPortfolioItemDelete.mockResolvedValue({});

        const res = await request(app)
            .delete('/portfolio/items/1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);
    });
  });

  describe('GET /watchlist', () => {
    it('should get user watchlist successfully', async () => {
        const watchlistData = { id: 1, profileId: 1, items: [] };
        mockProfileFindUnique.mockResolvedValue({ id: 1 });
        mockWatchlistFindUnique.mockResolvedValue(watchlistData);

        const res = await request(app)
          .get('/watchlist')
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(watchlistData);
      });
  });

  describe('POST /watchlist/items', () => {
    it('should add an item to the watchlist successfully', async () => {
        const watchlistItemData = { id: 1, symbol: 'AAPL', watchlistId: 1 };
        mockProfileFindUnique.mockResolvedValue({ id: 1, watchlist: { id: 1 } });
        mockWatchlistItemCreate.mockResolvedValue(watchlistItemData);

        const res = await request(app)
            .post('/watchlist/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ symbol: 'AAPL' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(watchlistItemData);
    });
  });

  describe('DELETE /watchlist/items/:itemId', () => {
    it('should delete a watchlist item successfully', async () => {
        mockWatchlistItemDelete.mockResolvedValue({});

        const res = await request(app)
            .delete('/watchlist/items/1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);
    });
  });
});
