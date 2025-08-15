---
sidebar_label: 'Real-Time Updates'
---

# Real-Time Price Updates

To provide a dynamic user experience, the application features real-time price updates on the main dashboard, powered by WebSockets.

## Backend Implementation

- The `market-data-service` hosts a WebSocket server that runs alongside the main Express API server.
- Every 2 seconds, the server simulates a price fluctuation for all stocks in the mock database.
- It then broadcasts a message of type `prices` to all connected clients. The message payload is an array of objects, each containing a `ticker` and its new `price`.

## Frontend Implementation

- The frontend establishes a WebSocket connection to the `market-data-service` at `ws://localhost:3002`.
- A `StockPriceProvider` component, using React Context, manages the WebSocket connection and stores the latest prices in a shared state.
- The `useStockPrices` hook allows any client component to access the latest price data.
- The dashboard table uses this hook to listen for price changes and updates the relevant cells in real-time without requiring a page refresh.
