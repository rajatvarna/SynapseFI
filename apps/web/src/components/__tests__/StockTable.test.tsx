import { render, screen } from '@testing-library/react';
import { StockTable } from '../StockTable';
import { StockPriceContext } from '../../context/StockPriceContext';
import { Stock } from 'shared-types';

const mockInitialStocks: Stock[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    description: 'A tech company.',
    marketCap: 2.77,
    peRatio: 28.5,
    historicalData: [{ date: '2023-10-05', price: 175.00 }],
  },
];

describe('StockTable', () => {
  it('renders with initial stock data', () => {
    render(<StockTable initialStocks={mockInitialStocks} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('$175.00')).toBeInTheDocument();
  });

  it('updates price from live context data', () => {
    const livePrices = { AAPL: 180.55 };

    render(
      <StockPriceContext.Provider value={livePrices}>
        <StockTable initialStocks={mockInitialStocks} />
      </StockPriceContext.Provider>
    );

    // The price should now be the one from the context
    expect(screen.getByText('$180.55')).toBeInTheDocument();
    expect(screen.queryByText('$175.00')).not.toBeInTheDocument();
  });
});
