import request from 'supertest';
import { app, server, initializeStockData, stockData } from '../index';
import { finnhubClient } from '../finnhub';

jest.mock('../finnhub');

const mockedFinnhubClient = finnhubClient as jest.Mocked<typeof finnhubClient>;

describe('Market Data API', () => {
  beforeAll(async () => {
    (mockedFinnhubClient.get as jest.Mock).mockImplementation(async (url: string, config: any) => {
      if (url === '/quote') {
        const symbol = config.params.symbol;
        return Promise.resolve({
          data: {
            c: 150.0,
            symbol: symbol
          },
        });
      }
      return Promise.reject(new Error('Not found'));
    });
    stockData.length = 0;
    await initializeStockData();
    server.listen(4002);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /stocks', () => {
    it('should return a list of all stocks', async () => {
      const response = await request(app).get('/stocks');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(5);
      expect(response.body[0].symbol).toBe('AAPL');
    });
  });

  describe('GET /stocks/:ticker', () => {
    it('should return data for a valid stock ticker', async () => {
      const ticker = 'AAPL';
      const response = await request(app).get(`/stocks/${ticker}`);
      expect(response.status).toBe(200);
      expect(response.body.symbol).toBe(ticker);
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
      expect(response.body.symbol).toBe('AAPL');
    });
  });
});
