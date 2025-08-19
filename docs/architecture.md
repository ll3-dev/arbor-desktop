# Architecture

This document provides a comprehensive overview of the Arbor Desktop application architecture.

## Overview

Arbor Desktop follows a standard Electron architecture with three main processes:

1. **Main Process** - Responsible for creating and managing application windows, handling system events, and running background tasks
2. **Renderer Process** - The React application that runs in a browser window
3. **Preload Script** - A bridge between the main and renderer processes

## Main Process

Location: `src/main`

The main process is responsible for:
- Creating and managing the application windows
- Handling system events (e.g., app lifecycle, window events)
- Running background tasks
- Exposing a tRPC API to the renderer process
- Managing the application's lifecycle

### Structure

```
src/main/
├── actions/        # tRPC procedure implementations
├── database/       # Database-related code
└── index.ts        # Entry point
```

## Renderer Process

Location: `src/renderer`

The renderer process is a React application that:
- Uses TanStack Router for routing
- Uses Zustand for state management
- Communicates with the main process using the tRPC API
- Provides the user interface

### Structure

```
src/renderer/
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── routes/       # Route definitions
│   ├── stores/       # Zustand stores
│   └── utils/        # Utility functions
└── index.html        # HTML entry point
```

## Preload Script

Location: `src/preload

The preload script acts as a bridge between the main and renderer processes:
- Exposes the tRPC client to the renderer process in a secure way
- Prevents direct access to Node.js APIs from the renderer process

## Shared Code

Location: `src/shared`

The shared directory contains code that is used by both the main and renderer processes:
- tRPC API definitions and types
- Shared types and interfaces
- Utility functions used by both processes

### Structure

```
src/shared/
├── apis/      # tRPC API definitions
└── type.ts    # Shared types
```

## Data Flow

1. Renderer process makes tRPC calls through the preload script
2. Preload script forwards calls to the main process
3. Main process executes the tRPC procedures in the actions directory
4. Results are returned through the same path

## Communication Patterns

### tRPC API

The application uses tRPC for type-safe communication between the main and renderer processes:
- API endpoints are defined in `src/shared/apis`
- Implementations are in `src/main/actions`
- Client is exposed through the preload script

### State Management

- **Zustand** is used for state management in the renderer process
- **Electron's IPC** can be used for direct communication between processes when needed

## Database

The application uses Drizzle ORM for database management:
- Database schema and migrations are in the `drizzle` directory
- Database interactions are handled in the main process
- The renderer process accesses data through tRPC APIs

## File Structure

```
src/
├── main/
│   ├── actions/
│   ├── database/
│   └── index.ts
├── preload/
│   └── index.ts
├── renderer/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── stores/
│   │   └── utils/
│   └── index.html
└── shared/
    ├── apis/
    └── type.ts
```

This architecture ensures a clean separation of concerns while maintaining efficient communication between processes.