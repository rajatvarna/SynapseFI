import { StockTable } from "@/components/StockTable";
import { Stock } from "shared-types";

async function getStocks(): Promise<Stock[]> {
  try {
    // In a real app, you'd fetch from your service, which might be on a different host.
    // For this example, we assume the service is running on localhost:3002.
    const res = await fetch("http://localhost:3002/stocks", {
      // Revalidate frequently to get the latest static data, though prices will update via WebSocket.
      next: { revalidate: 5 },
    });
    if (!res.ok) {
      // Return empty array on error, the UI will show a message.
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch initial stock data:", error);
    // Return empty array on network error etc.
    return [];
  }
}

export default async function Home() {
  const initialStocks = await getStocks();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Market Dashboard</h1>
      <StockTable initialStocks={initialStocks} />
    </main>
  );
}
