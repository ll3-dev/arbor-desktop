# Arbor Desktop

This document provides a comprehensive overview of the Arbor Desktop application, its architecture, and development conventions.

## Project Overview

Arbor Desktop is a cross-platform desktop application built with Electron, React, and TypeScript. It leverages a modern tech stack to provide a rich user experience. The application uses tRPC for type-safe communication between the main and renderer processes, Drizzle ORM for database management, and Tanstack Router for navigation.

### Core Technologies

- **Electron:** Framework for building cross-platform desktop applications with web technologies.
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite:** A fast build tool and development server for modern web projects.
- **tRPC:** A library for building end-to-end typesafe APIs.
- **Drizzle ORM:** A TypeScript ORM for SQL databases.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Tanstack Router:** A fully type-safe router for React.
- **Zustand:** A small, fast and scalable bearbones state-management solution.

### Architecture

The application follows a standard Electron architecture with a main process, a renderer process, and a preload script.

- **Main Process (`src/main`):** The main process is responsible for creating and managing the application windows, handling system events, and running background tasks. It exposes a tRPC API to the renderer process.
- **Renderer Process (`src/renderer`):** The renderer process is a React application that runs in a browser window. It uses Tanstack Router for routing and Zustand for state management. It communicates with the main process using the tRPC API.
- **Preload Script (`src/preload`):** The preload script is a bridge between the main and renderer processes. It exposes the tRPC client to the renderer process in a secure way.
- **Shared Code (`src/shared`):** The shared directory contains code that is used by both the main and renderer processes, such as the tRPC API definition and types.

## Building and Running

The project uses `pnpm` as its package manager.

### Installation

To install the dependencies, run:

```bash
pnpm install
```

### Development

To start the application in development mode, run:

```bash
pnpm dev
```

This will start the Vite development server for the renderer process and run the Electron application.

### Building for Production

To build the application for production, use the following commands:

- **Build for all platforms:**
  ```bash
  pnpm build
  ```
- **Build for Windows:**
  ```bash
  pnpm build:win
  ```
- **Build for macOS:**
  ```bash
  pnpm build:mac
  ```
- **Build for Linux:**
  ```bash
  pnpm build:linux
  ```

## Development Conventions

### Code Style

The project uses ESLint and Prettier to enforce a consistent code style. To format the code, run:

```bash
pnpm format
```

To lint the code, run:

```bash
pnpm lint
```

### Type Checking

The project uses TypeScript for static type checking. To check the types, run:

```bash
pnpm typecheck
```

### API Development

The application uses tRPC for type-safe communication between the main and renderer processes. The tRPC API is defined in the `src/shared/apis` directory. When adding a new API endpoint, you need to:

1.  Create a new router in the `src/shared/apis` directory.
2.  Add the new router to the `appRouter` in `src/shared/apis/index.ts`.
3.  Implement the tRPC procedure in the `src/main/actions` directory.

### State Management

The application uses Zustand for state management in the renderer process. Zustand is a small and simple state management library that is easy to use.

### Routing

The application uses Tanstack Router for routing in the renderer process. The routes are defined in the `src/renderer/src/routes` directory. Tanstack Router automatically generates a type-safe route tree based on the files in this directory.
