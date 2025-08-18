'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Trade {
  id: number;
  userId: number;
  symbol: string;
  quantity: number;
  price: number;
  type: string;
  createdAt: string;
}

export default function FeedPage() {
  const { token } = useAuth();
  const [feed, setFeed] = useState<Trade[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchFeed = async () => {
      try {
        const res = await fetch('http://localhost:3005/feed', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const feedData = await res.json();
          setFeed(feedData);
        } else {
          setError('Failed to fetch feed');
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    fetchFeed();
  }, [token, router]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (feed.length === 0) {
    return <p>Loading feed...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Social Feed</h1>
      <div className="space-y-4">
        {feed.map((trade) => (
          <div key={trade.id} className="p-4 border rounded-lg">
            <p>
              <span className="font-semibold">User {trade.userId}</span>{' '}
              <span className={trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
                {trade.type}
              </span>{' '}
              {trade.quantity} shares of {trade.symbol} at ${trade.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(trade.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
