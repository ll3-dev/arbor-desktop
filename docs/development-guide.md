# Development Guide

This guide covers the development conventions, best practices, and workflows for the Arbor Desktop application.

## Code Style

The project uses ESLint and Prettier to enforce a consistent code style.

### Formatting Code

To format the codebase:

```bash
pnpm format
```

### Linting Code

To lint the codebase:

```bash
pnpm lint
```

## Type Checking

The project uses TypeScript for static type checking.

To check the types:

```bash
pnpm typecheck
```

## Component Development

### Creating New Components

1. Create a new component file in `src/renderer/src/components/`
2. Use TypeScript for type safety
3. Follow the existing component patterns
4. Export the component from `src/renderer/src/components/index.ts`

### Component Structure

Components should follow this structure:

```tsx
import React from 'react';

interface ComponentNameProps {
  // Define props interface
}

export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};
```

## State Management

The application uses Zustand for state management in the renderer process.

### Creating a New Store

1. Create a new store file in `src/renderer/src/stores/`
2. Define the store state and actions
3. Export the store

Example store:

```ts
import { create } from 'zustand';

interface ExampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useExampleStore = create<ExampleState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

## Routing

The application uses TanStack Router for routing in the renderer process.

### Adding New Routes

1. Create a new route file in `src/renderer/src/routes/`
2. Define the route component
3. The route will be automatically added to the route tree

Routes are automatically generated based on the files in the routes directory.

## API Development

The application uses tRPC for type-safe communication between the main and renderer processes.

### Adding a New API Endpoint

1. Create a new router in `src/shared/apis/`
2. Add the new router to `appRouter` in `src/shared/apis/index.ts`
3. Implement the tRPC procedure in `src/main/actions/`

Example API definition:
```ts
// src/shared/apis/example.ts
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

Example API implementation:
```ts
// src/main/actions/example.ts
import { hello } from './example';

export const exampleActions = {
  hello: async (input: { name: string }) => {
    // Implementation
    return `Hello, ${input.name}!`;
  },
};
```

### Adding Tree Management APIs

To add new tree management functionality:

1. Create a new router in `src/shared/apis/tree.ts`
2. Add the new router to `appRouter` in `src/shared/apis/index.ts`
3. Implement the tRPC procedure in `src/main/actions/tree.ts`
4. Add database functions in `src/main/database/tree.ts`

Example tree API definition:
```ts
// src/shared/apis/tree.ts
import { publicProcedure, router } from '@main/actions/trpc';
import { createTree, deleteTree, getAllTrees, getTree, updateTree } from '@main/database/tree';
import z from 'zod';

export const treeRouter = router({
  getTree: publicProcedure.input(z.object({ treeId: z.number() })).query(async ({ input }) => {
    const { treeId } = input;
    return getTree(treeId);
  }),
  getAllTrees: publicProcedure.query(async () => {
    return getAllTrees();
  }),
  createTree: publicProcedure.input(z.object({ title: z.string() })).mutation(async ({ input }) => {
    const { title } = input;
    return createTree(title);
  }),
  deleteTree: publicProcedure.input(z.object({ treeId: z.number() })).mutation(async ({ input }) => {
    const { treeId } = input;
    return deleteTree(treeId);
  }),
  updateTree: publicProcedure.input(z.object({ treeId: z.number(), title: z.string() })).mutation(async ({ input }) => {
    const { treeId, title } = input;
    return updateTree(treeId, title);
  }),
});
```

Example tree API implementation:
```ts
// src/main/actions/tree.ts
import { deleteTree, updateTree } from '@main/database/tree';

export const deleteTreeAction = async (treeId: number) => {
  try {
    const result = await deleteTree(treeId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting tree:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const updateTreeAction = async (treeId: number, title: string) => {
  try {
    const result = await updateTree(treeId, title);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating tree:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
```

The application uses tRPC for type-safe communication between the main and renderer processes.

### Adding a New API Endpoint

1. Create a new router in `src/shared/apis/`
2. Add the new router to `appRouter` in `src/shared/apis/index.ts`
3. Implement the tRPC procedure in `src/main/actions/`

Example API definition:

```ts
// src/shared/apis/example.ts
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

Example API implementation:

```ts
// src/main/actions/example.ts
import { hello } from './example';

export const exampleActions = {
  hello: async (input: { name: string }) => {
    // Implementation
    return `Hello, ${input.name}!`;
  },
};
```

## Database Development

The application uses Drizzle ORM for database management.

### Adding New Database Tables

1. Update the schema in `drizzle/schema.ts`
2. Create a migration using Drizzle Kit
3. Update the database interactions in the main process

## Testing

To run tests:

```bash
pnpm test
```

To run tests with UI:

```bash
pnpm test:ui
```

### Writing Tests

1. Create test files next to the components they test
2. Use the `.test.tsx` extension
3. Follow the existing test patterns

## Git Workflow

1. Create a feature branch from `main`
2. Make commits with clear, descriptive messages
3. Push the branch to the remote repository
4. Create a pull request for review
5. Address any feedback
6. Merge after approval

## Commit Message Convention

Follow the conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Write a clear description of the changes
4. Request review from team members
5. Address feedback
6. Merge after approval

## Debugging

### Renderer Process

Use the browser developer tools that are available in the Electron application.

### Main Process

Use the Node.js inspector:

1. Add `--inspect` flag to the Electron command
2. Open `chrome://inspect` in Chrome
3. Connect to the Node.js instance

## Performance Considerations

1. Avoid blocking the main process with long-running operations
2. Use web workers for CPU-intensive tasks in the renderer process
3. Optimize database queries
4. Minimize IPC calls between processes
5. Use React.memo for components that render frequently
6. Implement virtual scrolling for large lists
