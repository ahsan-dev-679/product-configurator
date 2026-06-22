# Product Configurator Dashboard

A full-stack application to manage product configurations and their associated variants. Built with Next.js (Frontend), NestJS (Backend), and MongoDB (Database), fully containerized for local development.

## Project Structure

```
product-configurator/
├── frontend/        # Next.js (TypeScript) client application
├── backend/         # NestJS (TypeScript) API server
└── docker-compose.yml
```

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Getting Started

1. Clone the repository:
```bash
   git clone https://github.com/ahsan-dev-679/product-configurator.git
   cd product-configurator
```

2. Start all services:
```bash
   docker compose up --build
```

3. Once ready, open:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:3001/api
   - **Products endpoint:** http://localhost:3001/api/products


   ![Dashboardt](image.png)
   ![API](image-1.png)

## Features

- **Auto-Code Generation:** Product names are automatically converted to codes (e.g., "Tankdeckel" → "TD")
- **Variant Management:** Backend automatically assigns unique two-digit variant codes (01, 02, 03...)
- **Assignments:** Each variant maps to one or more Baureihe (model series) and their models
- **Validation:** Input validation on both frontend and backend with proper error handling
- **Persistence:** MongoDB with a named volume for persistent data across restarts

## Testing

Run backend tests locally:
```bash
cd backend
npm install
npm test
```

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, Mongoose
- **Database:** MongoDB 6.0
- **Infrastructure:** Docker, Docker Compose