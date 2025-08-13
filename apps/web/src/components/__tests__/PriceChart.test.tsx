import { render, screen } from '@testing-library/react';
import { PriceChart } from '../PriceChart';

// Mock Recharts because it has issues rendering in a JSDOM environment
jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CartesianGrid: () => <div />,
}));

const mockData = [
  { date: '2023-10-01', price: 170.00 },
  { date: '2023-10-02', price: 172.30 },
];

describe('PriceChart', () => {
  it('renders without crashing', () => {
    render(<PriceChart data={mockData} />);
    // Since we mocked the components, we can't assert on the chart itself,
    // but we know it didn't crash if we get this far.
    expect(true).toBe(true);
  });
});
