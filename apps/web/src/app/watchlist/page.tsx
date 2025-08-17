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

interface WatchlistItem {
  id: number;
  symbol: string;
}

interface Watchlist {
  id: number;
  profileId: number;
  items: WatchlistItem[];
}

export default function WatchlistPage() {
  const { token } = useAuth();
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const livePrices = useStockPrices();
  const [newSymbol, setNewSymbol] = useState('');

  const fetchWatchlist = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3003/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const watchlistData = await res.json();
        setWatchlist(watchlistData);
      } else {
        setError('Failed to fetch watchlist');
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
    fetchWatchlist();
  }, [token, router, fetchWatchlist]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3003/watchlist/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: newSymbol.toUpperCase() }),
      });

      if (res.ok) {
        setNewSymbol('');
        fetchWatchlist(); // Refetch watchlist to show the new item
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

    if (!confirm('Are you sure you want to remove this item from your watchlist?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3003/watchlist/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchWatchlist(); // Refetch watchlist to show the changes
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to delete item');
      }
    } catch (err) {
      setError('An error occurred while deleting item');
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!watchlist) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>

      <form onSubmit={handleAddItem} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Add New Stock to Watchlist</h3>
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
          <div className="flex items-end">
            <Button type="submit">Add to Watchlist</Button>
          </div>
        </div>
      </form>

      <Table>
        <TableCaption>Your watchlist of stocks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.items.map((item) => {
            const currentPrice = livePrices[item.symbol] || 0;
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.symbol}</TableCell>
                <TableCell>${currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                    Remove
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
