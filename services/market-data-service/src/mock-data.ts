import { Stock } from 'shared-types';

export const mockStockData: Stock[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.',
    marketCap: 2.77, // In trillions
    peRatio: 28.5,
    historicalData: [
      { date: '2023-10-01', price: 170.00 },
      { date: '2023-10-02', price: 172.30 },
      { date: '2023-10-03', price: 171.25 },
      { date: '2023-10-04', price: 173.98 },
      { date: '2023-10-05', price: 175.84 },
    ],
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Alphabet Inc. is an American multinational conglomerate holding company. It was created through a restructuring of Google on October 2, 2015.',
    marketCap: 1.71, // In trillions
    peRatio: 25.8,
    historicalData: [
      { date: '2023-10-01', price: 130.50 },
      { date: '2023-10-02', price: 132.10 },
      { date: '2023-10-03', price: 131.85 },
      { date: '2023-10-04', price: 134.00 },
      { date: '2023-10-05', price: 135.24 },
    ],
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    description: 'Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    marketCap: 1.34, // In trillions
    peRatio: 58.2,
    historicalData: [
      { date: '2023-10-01', price: 125.30 },
      { date: '2023-10-02', price: 127.80 },
      { date: '2023-10-03', price: 126.90 },
      { date: '2023-10-04', price: 129.50 },
      { date: '2023-10-05', price: 131.45 },
    ],
  },
];
