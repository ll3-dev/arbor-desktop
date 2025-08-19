# Arbor Desktop Documentation Summary

This document provides an overview of all the documentation available for the Arbor Desktop project.

## Table of Contents

1. [README](README.md) - Project overview and documentation navigation
2. [Getting Started](getting-started.md) - Installation and setup instructions
3. [Architecture](architecture.md) - Detailed overview of the application architecture
4. [Development Guide](development-guide.md) - Coding conventions, best practices, and development workflows
5. [API Reference](api-reference.md) - Documentation for the tRPC API
6. [Database](database.md) - Information about the database schema and migrations
7. [Testing](testing.md) - Testing strategies and guidelines
8. [Deployment](deployment.md) - Build and deployment processes
9. [Contributing](contributing.md) - Guidelines for contributing to the project

## Document Summaries

### README.md
Provides an overview of the project and links to all other documentation files. This is the starting point for anyone new to the project.

### getting-started.md
Contains detailed instructions for setting up the development environment, installing dependencies, and running the application in development mode. Also includes information about building for production.

### architecture.md
Explains the Electron application architecture, including the main process, renderer process, preload script, and shared code. Details the data flow and communication patterns between components.

### development-guide.md
Covers development conventions, coding standards, component development, state management, routing, API development, database development, testing, Git workflow, and debugging techniques.

### api-reference.md
Documents the tRPC API used for communication between the main and renderer processes, including available endpoints, input/output types, and examples.

### database.md
Provides information about the database setup, schema management, migrations, and database operations using Drizzle ORM.

### testing.md
Covers the testing strategies, tools, and guidelines for the application, including unit tests, component tests, integration tests, mocking, test coverage, and best practices.

### deployment.md
Documents the build and deployment processes for different platforms (Windows, macOS, Linux), including configuration, release process, code signing, distribution, and auto-updates.

### contributing.md
Provides guidelines for contributing to the project, including reporting bugs, suggesting enhancements, code contributions, pull request process, code style, testing, documentation, and community guidelines.

## Additional Resources

- [Package.json](../package.json) - Project dependencies and scripts
- [QWEN.md](../QWEN.md) - Additional project context
- [AGENTS.md](../AGENTS.md) - Agent documentation
- [README.md](../README.md) - Main project README