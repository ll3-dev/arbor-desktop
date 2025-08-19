# Getting Started

This guide will help you set up and run the Arbor Desktop application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) (package manager)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd arbor-desktop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

To start the application in development mode:

```bash
pnpm dev
```

This will start the Vite development server for the renderer process and run the Electron application.

## Building for Production

To build the application for production:

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

## Scripts

The following npm scripts are available in the project:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the application in development mode |
| `pnpm build` | Build the application for production |
| `pnpm format` | Format code with Prettier |
| `pnpm lint` | Lint code with ESLint |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm test` | Run tests |
| `pnpm test:ui` | Run tests with UI |

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Troubleshooting

If you encounter any issues during setup:

1. Ensure all prerequisites are installed and up to date
2. Clear pnpm cache: `pnpm store prune`
3. Remove node_modules and reinstall: `rm -rf node_modules && pnpm install`
4. Check the [Issues](https://github.com/your-repo/issues) section of the repository