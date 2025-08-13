---
sidebar_label: 'Market Data API'
---

# Market Data API

The `market-data-service` provides API endpoints for fetching stock information.

## Endpoints

### Get All Stocks

- **URL**: `/stocks`
- **Method**: `GET`
- **Description**: Retrieves a list of all available stocks with their basic information.
- **Success Response**:
  - **Code**: 200 `OK`
  - **Content**: `Stock[]`
    ```json
    [
      {
        "ticker": "AAPL",
        "name": "Apple Inc.",
        "description": "...",
        "marketCap": 2.77,
        "peRatio": 28.5,
        "historicalData": [...]
      },
      ...
    ]
    ```

### Get Stock by Ticker

- **URL**: `/stocks/:ticker`
- **Method**: `GET`
- **URL Params**:
  - `ticker=[string]` (e.g., `AAPL`)
- **Description**: Retrieves detailed information for a single stock.
- **Success Response**:
  - **Code**: 200 `OK`
  - **Content**: `Stock`
    ```json
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "description": "...",
      "marketCap": 2.77,
      "peRatio": 28.5,
      "historicalData": [...]
    }
    ```
- **Error Response**:
  - **Code**: 404 `Not Found`
  - **Content**:
    ```json
    {
      "message": "Stock with ticker AAPL not found."
    }
    ```

## WebSocket API

The service also provides real-time price updates via a WebSocket connection.

- **URL**: `ws://localhost:3002`
- **Protocol**: WebSocket
- **Broadcast Message**:
  - The server broadcasts messages every 2 seconds to all clients.
  - **Content**:
    ```json
    {
      "type": "prices",
      "data": [
        { "ticker": "AAPL", "price": 175.88 },
        { "ticker": "GOOGL", "price": 135.20 },
        ...
      ]
    }
    ```
