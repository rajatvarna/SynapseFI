# Testing Issues

This file documents the current issues with the test suite.

## `apps/web`
- **Problem**: `ReferenceError: Cannot access 'Mock...Context' before initialization` and `TypeError: Cannot read properties of undefined (reading 'Provider')`.
- **Cause**: Issues with mocking React Contexts for `AuthContext` and `StockPriceContext`. The `renderWithContext` helper is not working as expected.
- **Next Steps**:
    1.  Re-evaluate the context mocking strategy.
    2.  Consider using a different approach, such as wrapping the components in the actual providers with mocked values.

## `services/auth-service`
- **Problem**: Tests are failing with incorrect status codes (400 instead of 200/201).
- **Cause**: The Prisma client mock is not being used by the tests. The `jest.mock('@prisma/client')` call is not working as expected.
- **Next Steps**:
    1.  Investigate why the Prisma mock is not being applied.
    2.  Try a different mocking strategy for Prisma, perhaps by mocking the `PrismaClient` constructor.

## `services/market-data-service`
- **Problem**: Tests are failing with `TypeError: Cannot read properties of undefined (reading 'get')`.
- **Cause**: The `axios` mock is not being applied correctly. The `finnhubClient` is initialized with the real `axios` before the mock is in place.
- **Next Steps**:
    1.  Refactor the `finnhubClient` creation to be more easily mockable, for example, by moving it to a separate file and mocking that file.
    2.  Ensure the mock is in place before any code that uses `finnhubClient` is executed.

I will now proceed with manual verification of the application.
I will kill all running node processes and then start them one by one to isolate the issue.

First, kill all node processes.
`pkill -f node`

Then, start the `auth-service` and check its logs.
`npm run dev --workspace=services/auth-service > auth-service.log 2>&1 &`
`sleep 5 && cat auth-service.log`

If it crashes, I will try to run it with `ts-node` directly to get a better error message.
`ts-node services/auth-service/src/index.ts`
This should give me a more detailed error message.

I will then proceed to fix the services one by one until they are all running, and then perform manual verification of the features.
