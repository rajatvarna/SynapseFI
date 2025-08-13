"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type PriceUpdate = {
  ticker: string;
  price: number;
};

type PriceData = {
  [ticker: string]: number;
};

const StockPriceContext = createContext<PriceData>({});

export const useStockPrices = () => useContext(StockPriceContext);

export const StockPriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<PriceData>({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "prices") {
        const newPrices: PriceData = {};
        message.data.forEach((update: PriceUpdate) => {
          newPrices[update.ticker] = update.price;
        });
        setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <StockPriceContext.Provider value={prices}>
      {children}
    </StockPriceContext.Provider>
  );
};
