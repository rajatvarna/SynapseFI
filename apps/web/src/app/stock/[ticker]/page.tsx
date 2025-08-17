'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stock } from "shared-types";
import { notFound } from "next/navigation";
import { PriceChart } from "@/components/PriceChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type StockPageProps = {
  params: {
    ticker: string;
  };
};

async function getStockData(ticker: string): Promise<Stock | null> {
    try {
      const res = await fetch(`http://localhost:3002/stocks/${ticker}`, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!res.ok) {
        return null;
      }
      return res.json();
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
      return null;
    }
}

export default function StockPage({ params }: StockPageProps) {
    const { token } = useAuth();
    const [stockData, setStockData] = useState<Stock | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndSetStockData = async () => {
            const data = await getStockData(params.ticker);
            if (data) {
                setStockData(data);
            } else {
                notFound();
            }
        };
        fetchAndSetStockData();
    }, [params.ticker]);


  const handleTrade = async (tradeType: 'BUY' | 'SELL') => {
    if (!token) {
        setError("You must be logged in to trade.");
        return;
    }
    setError(null);

    try {
      const res = await fetch(`http://localhost:3005/${tradeType.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: params.ticker, quantity }),
      });

      if (res.ok) {
        alert(`Successfully ${tradeType === 'BUY' ? 'bought' : 'sold'} ${quantity} shares of ${params.ticker}`);
        // Optionally, refetch user profile/balance data here
      } else {
        const errorData = await res.json();
        setError(errorData.error || `Failed to ${tradeType.toLowerCase()} stock`);
      }
    } catch (err) {
      setError(`An error occurred while trying to ${tradeType.toLowerCase()} stock`);
    }
  };

  if (!stockData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left Column */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {stockData.name} ({stockData.ticker})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{stockData.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Market Cap</TableCell>
                  <TableCell>${stockData.marketCap}T</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>P/E Ratio</TableCell>
                  <TableCell>{stockData.peRatio}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
            <CardDescription>Last 5 days</CardDescription>
          </CardHeader>
          <CardContent>
            <PriceChart ticker={params.ticker} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            min="1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={() => handleTrade('BUY')}>Buy</Button>
                        <Button variant="secondary" onClick={() => handleTrade('SELL')}>Sell</Button>
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
