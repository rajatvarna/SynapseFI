import request from 'supertest';
import { app, server, initializeStockData, stockData } from '../index';
import { finnhubClient } from '../finnhub';
import { WebSocket } from 'ws';

import { FinnhubWS } from '@stoqey/finnhub';

jest.mock('../finnhub');
jest.mock('@stoqey/finnhub');

const mockedFinnhubClient = finnhubClient as jest.Mocked<typeof finnhubClient>;
const mockedFinnhubWS = FinnhubWS as jest.MockedClass<typeof FinnhubWS>;

describe('Market Data API', () => {
  let ws: WebSocket;

  beforeEach((done) => {
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
    initializeStockData().then(() => {
      server.listen(4002, () => {
        ws = new WebSocket('ws://localhost:4002');
        ws.on('open', done);
      });
    });
  });

  afterEach((done) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
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

  describe('WebSocket', () => {
    it('should send price updates', (done) => {
      jest.setTimeout(10000);
      const trade = {
        data: [{ p: 200, s: 'AAPL', t: Date.now(), v: 100 }],
        type: 'trade',
      };
      mockedFinnhubWS.prototype.on.mockImplementation(function(this: any, event, callback) {
        if (event === 'onData') {
          callback(trade);
        }
        return this;
      });

      ws.on('message', (data: string) => {
        const message = JSON.parse(data);
        expect(message.type).toBe('price-update');
        expect(message.data).toHaveProperty('symbol', 'AAPL');
        expect(message.data).toHaveProperty('price', 200);
        expect(message.data).toHaveProperty('timestamp');
        ws.close();
        done();
      });
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
