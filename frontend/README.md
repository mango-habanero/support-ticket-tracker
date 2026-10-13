# Frontend

## Overview

This is the frontend of the support ticket tracker, the part of the application that a user sees and uses in a web browser. The interface is built with Next.js 16.4.0.

## Prerequisites

- Node.js 24.
- pnpm, in the version that the `packageManager` field of `package.json` names.
- A running ticket API at the address that `API_BASE_URL` names.
- Internet access on the first run, for the npm registry and Google Fonts.
- Port 3000 free on this computer.

## Run locally

1. Copy the example configuration.

```bash
   cp .env.example .env.local
```

2. Install the dependencies.

```bash
   pnpm install
```

3. Start the development server.

```bash
   pnpm dev
```

The interface runs at http://localhost:3000.

## Configuration

The interface reads one environment variable.

| Variable       | Example                        | Effect                                                              |
|----------------|--------------------------------|---------------------------------------------------------------------|
| `API_BASE_URL` | `http://localhost:8095/api/v1` | Sets the base address of the ticket API, including its path prefix. |

Only the server reads this variable, and it reads the variable on every request. Restart the development server after a change. When the variable is missing, the page shows an error and the server log reports `API_BASE_URL is not set.`

## Scripts

| Command      | Purpose                                   |
|--------------|-------------------------------------------|
| `pnpm lint`  | Checks the code with ESLint.              |
| `pnpm build` | Builds the production server.             |
| `pnpm start` | Runs the production server after a build. |