const mockAxios: any = {
  create: jest.fn(() => mockAxios),
  get: jest.fn((url: string, config: any) => {
    if (url === '/quote') {
      const symbol = config.params.symbol;
      return Promise.resolve({
        data: {
          c: 150.0,
          symbol: symbol,
          name: `${symbol} Inc.`,
          description: 'A tech company.',
          marketCap: 2.77,
          peRatio: 28.5,
          historicalData: [{ date: '2023-10-05', price: 175.00 }],
        },
      });
    }
    return Promise.reject(new Error('Not found'));
  }),
};

export default mockAxios;
