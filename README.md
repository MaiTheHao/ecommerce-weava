# WEAVA

**WEAVA** is an e-commerce management application for apparel, built with modern technologies.

-   **Backend:** ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=flat) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=flat)
-   **Frontend:** ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat) ![AdminLTE](https://img.shields.io/badge/AdminLTE-222B2F?logo=adminlte&logoColor=white&style=flat) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)

## Features

-   User authentication & authorization (roles, permissions)
-   Product & category management
-   Order processing & payment methods
-   Address management (province, district, ward)
-   Product variations (size, color)
-   Product reviews & images
-   Admin dashboard (powered by AdminLTE)

## Tech Stack

| Technology     | Version         | Badge                                                                                                    |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| Node.js        | v22.20.0        | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat)          |
| NestJS         | 11.0.10         | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=flat)             |
| React          | 19.1.1          | ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat)                |
| Vite           | 7.1.7           | ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat)                   |
| Prisma         | 6.18.0          | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat)             |
| TypeScript     | 5.7.3           | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat) |
| ESLint (FE/BE) | 9.36.0 / 9.18.0 | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=flat)             |
| MySQL          | -               | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=flat)                |
| pnpm           | 10.18.3         | ![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white&style=flat)                   |

## Directory Structure

```
backend/   # NestJS API & business logic
frontend/  # React client (Vite)
docs/      # Documentation & ERD
```

## Packages

-   **Monorepo:** Managed with ![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white&style=flat).
-   **Backend:** ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=flat), ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat), ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat), Jest, ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=flat), Prettier, ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=flat).
-   **Frontend:** ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat), ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat), ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat), ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white&style=flat).

## Database Schema

The database is designed for e-commerce, supporting users, products, orders, reviews, etc. See [`docs/erd.yaml`](docs/erd.yaml) for details.
