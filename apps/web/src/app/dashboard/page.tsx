'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface StockData {
  symbol: string;
  price: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchMarketData = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3002/stocks');
      if (res.ok) {
        const data = await res.json();
        setStocks(data);
      } else {
        console.error('Failed to fetch market data');
      }
    } catch (err) {
      console.error('An error occurred while fetching market data', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    fetchProfile();
    fetchMarketData();
  }, [router, fetchMarketData]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => router.push('/profile')}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Go to Profile
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Market Data</h2>
          <button
            onClick={fetchMarketData}
            className="bg-green-500 text-white p-2 rounded"
          >
            Refresh
          </button>
        </div>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td className="border p-2">{stock.symbol}</td>
                <td className="border p-2">${stock.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
