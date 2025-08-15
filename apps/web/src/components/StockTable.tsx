"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockPrices } from "@/context/StockPriceContext";
import { Stock } from "shared-types";
import Link from "next/link";

interface StockTableProps {
  initialStocks: Stock[];
}

export function StockTable({ initialStocks }: StockTableProps) {
  const livePrices = useStockPrices();

  return (
    <Table>
      <TableCaption>A list of popular stocks. Prices update in real-time.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialStocks.map((stock) => {
          const latestPrice = livePrices[stock.ticker] ?? stock.historicalData[0]?.price;
          return (
            <TableRow key={stock.ticker}>
              <TableCell className="font-medium">
                <Link href={`/stock/${stock.ticker}`} className="text-blue-600 hover:underline">
                  {stock.ticker}
                </Link>
              </TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell className="text-right">
                ${latestPrice ? latestPrice.toFixed(2) : 'N/A'}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
