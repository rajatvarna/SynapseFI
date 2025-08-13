---
sidebar_label: 'Stock Detail Page'
---

# Stock Detail Page

The Stock Detail Page provides in-depth information about a specific stock.

## URL Structure

The page uses a dynamic route structure: `/stock/[ticker]`, where `[ticker]` is the stock symbol (e.g., `/stock/AAPL`).

## Features

- **Company Information**: Displays the company's name, ticker symbol, and a brief description.
- **Key Metrics**: Shows important financial metrics in a table, such as Market Cap and P/E Ratio.
- **Price Chart**: A dedicated section for visualizing historical price data (chart implementation is pending).

## Data Fetching

The page is a React Server Component (RSC) that fetches data on the server from the `market-data-service` before rendering. It calls the `/stocks/:ticker` endpoint to get the information for the requested stock.

If a stock ticker is not found, the page will display a standard 404 "Not Found" page.
