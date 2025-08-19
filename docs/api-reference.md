# API Reference

This document provides documentation for the tRPC API used in the Arbor Desktop application.

## Overview

The application uses tRPC for type-safe communication between the main and renderer processes. The API is defined in the `src/shared/apis` directory and implemented in the `src/main/actions` directory.

## Available Routers

1. [App Router](#app-router)
2. [Database Router](#database-router)

## App Router

The app router contains general application-level APIs.

### ping

Checks if the API is responsive.

**Endpoint:** `app.ping`

**Input:** None

**Output:** `string`

**Example:**
```ts
const result = await trpc.app.ping.query();
// result: "pong"
```

## Database Router

The database router contains APIs for database operations.

### getTables

Retrieves a list of all tables in the database.

**Endpoint:** `db.getTables`

**Input:** None

**Output:** `string[]`

**Example:**
```ts
const tables = await trpc.db.getTables.query();
// tables: ["users", "posts", "comments"]
```

### query

Executes a SQL query against the database.

**Endpoint:** `db.query`

**Input:**
```ts
{
  sql: string;
  parameters?: any[];
}
```

**Output:** 
```ts
{
  rows: any[];
  rowCount: number;
}
```

**Example:**
```ts
const result = await trpc.db.query.mutate({
  sql: "SELECT * FROM users WHERE id = ?",
  parameters: [1]
});
```

## Adding New APIs

To add a new API endpoint:

1. Create a new router in `src/shared/apis/`
2. Add the new router to `appRouter` in `src/shared/apis/index.ts`
3. Implement the tRPC procedure in `src/main/actions/`

### Example

1. Create `src/shared/apis/example.ts`:
```ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const exampleRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});
```

2. Add to `src/shared/apis/index.ts`:
```ts
import { exampleRouter } from './example';

export const appRouter = t.router({
  // ... other routers
  example: exampleRouter,
});
```

3. Implement in `src/main/actions/example.ts`:
```ts
export const exampleActions = {
  hello: async (input: { name: string }) => {
    return `Hello, ${input.name}!`;
  },
};
```

## Error Handling

API errors are automatically handled by tRPC and will be thrown as exceptions in the renderer process. Always wrap API calls in try/catch blocks:

```ts
try {
  const result = await trpc.example.hello.query({ name: "World" });
  console.log(result);
} catch (error) {
  console.error("API Error:", error);
}
```

## Type Safety

One of the key benefits of tRPC is end-to-end type safety. The types defined in the API procedures are automatically available in the renderer process, providing autocomplete and compile-time error checking.