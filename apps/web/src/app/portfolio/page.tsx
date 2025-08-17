'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStockPrices } from '@/context/StockPriceContext';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PortfolioItem {
  id: number;
  symbol: string;
  quantity: number;
}

interface Portfolio {
  id: number;
  profileId: number;
  items: PortfolioItem[];
}

export default function PortfolioPage() {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const livePrices = useStockPrices();
  const [newSymbol, setNewSymbol] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);

  const fetchPortfolio = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3003/portfolio', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const portfolioData = await res.json();
        setPortfolio(portfolioData);
      } else {
        setError('Failed to fetch portfolio');
      }
    } catch (err) {
      setError('An error occurred');
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPortfolio();
  }, [token, router, fetchPortfolio]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3003/portfolio/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: newSymbol.toUpperCase(), quantity: newQuantity }),
      });

      if (res.ok) {
        setNewSymbol('');
        setNewQuantity(1);
        fetchPortfolio(); // Refetch portfolio to show the new item
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to add item');
      }
    } catch (err) {
      setError('An error occurred while adding item');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3003/portfolio/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchPortfolio(); // Refetch portfolio to show the changes
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to delete item');
      }
    } catch (err) => {
      setError('An error occurred while deleting item');
    }
  };

  const calculateTotalValue = () => {
    if (!portfolio || !portfolio.items) return 0;
    return portfolio.items.reduce((total, item) => {
      const price = livePrices[item.symbol] || 0;
      return total + price * item.quantity;
    }, 0);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!portfolio) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Portfolio</h1>
      <h2 className="text-2xl mb-4">Total Value: ${calculateTotalValue().toFixed(2)}</h2>

      <form onSubmit={handleAddItem} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Add New Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g. AAPL"
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit">Add to Portfolio</Button>
          </div>
        </div>
      </form>

      <Table>
        <TableCaption>Your portfolio of stocks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolio.items.map((item) => {
            const currentPrice = livePrices[item.symbol] || 0;
            const totalValue = currentPrice * item.quantity;
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.symbol}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${totalValue.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
