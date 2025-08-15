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

export default async function StockPage({ params }: StockPageProps) {
  const stockData = await getStockData(params.ticker);

  if (!stockData) {
    notFound();
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
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
            <CardDescription>Last 5 days</CardDescription>
          </CardHeader>
          <CardContent>
            <PriceChart data={stockData.historicalData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
