# SynapseFI

This is a monorepo project that includes a web application, a documentation site, and several backend microservices.

## Project Structure

The project is organized as a monorepo using npm workspaces:

-   `apps/web`: A [Next.js](https://nextjs.org/) web application.
-   `apps/docs`: A [Docusaurus](https://docusaurus.io/) documentation site.
-   `services/*`: A collection of backend services (e.g., `auth-service`, `market-data-service`).
-   `packages/*`: Shared packages used across the monorepo (e.g., `ui-kit`, `shared-types`).
-   `infra/`: Infrastructure as code using Terraform.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (v8 or later recommended)
-   [Docker](https://www.docker.com/) (for running backend services)

### Installation

Clone the repository and install the dependencies from the root of the project:

```bash
git clone https://github.com/rajatvarna/SynapseFI.git
cd SynapseFI
npm install
```

### Environment Variables

This project uses `.env` files to manage environment variables. To get started, copy the `.env.example` file in each application or service to a new `.env` file and fill in the required values.

For example, for the web application:

```bash
cp apps/web/.env.example apps/web/.env.local
```

And for a backend service:

```bash
cp services/auth-service/.env.example services/auth-service/.env
```

The `.env` files are ignored by Git, so you can safely store your secrets in them.

## Development

You can run each application from the root of the monorepo using npm workspace commands.

### Web Application

To start the Next.js web application in development mode:

```bash
npm run dev --workspace=web
```

The application will be available at `http://localhost:3000`.

### Documentation Site

To start the Docusaurus documentation site:

```bash
npm run start --workspace=docs
```

The site will be available at `http://localhost:3000` (or a different port if 3000 is occupied).

### Backend Services

The backend services are designed to run in Docker containers. Each service has its own `Dockerfile`. To build and run a service, navigate to its directory and use Docker commands. For example, for the `auth-service`:

```bash
cd services/auth-service
docker build -t auth-service .
docker run -p 3001:3001 auth-service
```

## Linting

To check the code for linting errors, run the following command from the root of the project:

```bash
npm run lint
```
