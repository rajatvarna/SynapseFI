# Features TODO List

1.  **Implement Robust Input Validation and Error Handling:** The application currently lacks comprehensive input validation, particularly in the `auth-service`. Implementing a validation library (such as Zod or Joi) would ensure that all incoming data adheres to a strict schema, preventing invalid data from reaching the database and improving overall security. This would also allow for more consistent and informative error messages to be returned to the client.

2.  **Introduce Role-Based Access Control (RBAC):** To enhance security and provide more granular control over user permissions, I recommend implementing a role-based access control system. This would involve assigning roles (e.g., 'admin', 'user') to users and restricting access to certain API endpoints and application features based on these roles.

3.  **Refactor the Market Data Service for Efficiency and Scalability:** The current implementation of the `market-data-service` broadcasts all price updates to all connected clients, which is inefficient. I suggest refactoring this service to only send incremental updates for the specific stocks that have changed. Additionally, implementing a more robust WebSocket connection handling mechanism, including reconnection logic, would improve the service's reliability.

4.  **Develop a Comprehensive User Profile Management System:** The `user-profile-service` is currently a placeholder. I propose building this out into a full-featured service that allows users to manage their profiles, including updating their personal information, changing their passwords, and setting their preferences.

5.  **Enhance the Trading Service with Advanced Order Types:** The `trading-service` is also a placeholder. To make it a more powerful and realistic trading platform, I recommend adding support for advanced order types, such as limit orders, stop-loss orders, and trailing stop orders. This would provide users with more control over their trades and allow for more sophisticated trading strategies.
