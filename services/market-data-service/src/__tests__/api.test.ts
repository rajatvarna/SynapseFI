import request from 'supertest';
import { app, server, priceUpdateInterval } from '../index'; // Import the app and server
import { mockStockData } from '../mock-data';

describe('Market Data API', () => {
  // After all tests are finished, close the server and clear intervals to prevent hanging processes.
  afterAll((done) => {
    clearInterval(priceUpdateInterval);
    server.close(done);
  });

  describe('GET /stocks', () => {
    it('should return a list of all stocks', async () => {
      const response = await request(app).get('/stocks');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(mockStockData.length);
      expect(response.body[0].ticker).toBe('AAPL');
    });
  });

  describe('GET /stocks/:ticker', () => {
    it('should return data for a valid stock ticker', async () => {
      const ticker = 'AAPL';
      const response = await request(app).get(`/stocks/${ticker}`);
      expect(response.status).toBe(200);
      expect(response.body.ticker).toBe(ticker);
      expect(response.body.name).toBe('Apple Inc.');
    });

    it('should return 404 for an invalid stock ticker', async () => {
      const ticker = 'FAKE';
      const response = await request(app).get(`/stocks/${ticker}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`Stock with ticker ${ticker} not found.`);
    });

    it('should be case-insensitive', async () => {
      const ticker = 'aapl';
      const response = await request(app).get(`/stocks/${ticker}`);
      expect(response.status).toBe(200);
      expect(response.body.ticker).toBe('AAPL');
    });
  });
});
