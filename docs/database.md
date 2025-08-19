# Database

This document provides information about the database setup, schema, and management in the Arbor Desktop application.

## Overview

The application uses Drizzle ORM for database management with a PostgreSQL-compatible database. The database schema and migrations are managed using Drizzle Kit.

## Database Setup

The database is automatically initialized when the application starts. The database file is stored in the user's application data directory.

## Schema Management

The database schema is defined in `drizzle/schema.ts`. This file contains the table definitions using Drizzle's schema definition syntax.

### Example Table Definition

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

## Migrations

Database migrations are managed using Drizzle Kit. Migration files are stored in the `drizzle` directory.

### Generating Migrations

To generate a new migration:

```bash
pnpm drizzle-kit generate
```

### Applying Migrations

Migrations are automatically applied when the application starts.

## Database Operations

Database operations are performed in the main process through the tRPC API. The renderer process should not directly access the database but should use the API instead.

### Example Database Operation

```ts
// In src/main/actions/db.ts
import { db } from '../database';
import { users } from '../../drizzle/schema';

export const dbActions = {
  getUsers: async () => {
    return await db.select().from(users);
  },
  
  createUser: async (userData: typeof users.$inferInsert) => {
    return await db.insert(users).values(userData);
  },
};
```

## Querying Data

Data can be queried through the database API:

```ts
// In the renderer process
const users = await trpc.db.query.query({
  sql: "SELECT * FROM users"
});
```

## Performance Considerations

1. Use indexes for frequently queried columns
2. Limit the number of rows returned in queries
3. Use parameterized queries to prevent SQL injection
4. Batch multiple operations when possible

## Backup and Recovery

Database backups are not automatically handled by the application. Users should regularly back up their application data directory to prevent data loss.

## Troubleshooting

If you encounter database issues:

1. Check the application logs for error messages
2. Verify that the database file exists and is accessible
3. Try resetting the database by deleting the database file (this will result in data loss)
4. Ensure that the schema definitions match the actual database structure