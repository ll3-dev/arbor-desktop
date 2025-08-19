# Deployment

This document covers the build and deployment processes for the Arbor Desktop application.

## Overview

The application is built using Electron Builder and can be packaged for Windows, macOS, and Linux platforms.

## Build Process

The build process consists of two main steps:
1. Building the application code using Electron Vite
2. Packaging the application using Electron Builder

## Building for Production

### All Platforms

To build for all supported platforms:

```bash
pnpm build
```

### Windows

To build for Windows:

```bash
pnpm build:win
```

### macOS

To build for macOS:

```bash
pnpm build:mac
```

### Linux

To build for Linux:

```bash
pnpm build:linux
```

## Configuration

### Electron Builder Configuration

The Electron Builder configuration is defined in `electron-builder.yml`:

```yaml
appId: com.arbor.desktop
productName: Arbor Desktop
directories:
  buildResources: build
files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.ts'
  - '!**/*.ts'
  - '!**/*.tsx'
  - '!**/*.map'
  - '!**/*.md'
  - '!**/*.txt'
  - '!**/*.yml'
  - '!**/*.yaml'
  - '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}'
  - '!**/node_modules/*.d.ts'
  - '!**/node_modules/.bin'
  - '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}'
  - '!**/._*'
  - '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,__pycache__,thumbs.db,.gitignore,.gitattributes,.editorconfig,.flowconfig,.jshintrc,.eslintrc,.prettierrc,.prettierignore}'
  - '!**/{appveyor.yml,.travis.yml,circle.yml}'
  - '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}'
win:
  target:
    - nsis
  artifactName: ${name}-${version}-setup.${ext}
mac:
  category: public.app-category.utilities
  target:
    - dmg
  artifactName: ${name}-${version}.${ext}
linux:
  target:
    - AppImage
  maintainer: Arbor
  vendor: Arbor
  synopsis: Arbor Desktop
  description: A cross-platform desktop application
  category: Utility
  artifactName: ${name}-${version}.${ext}
```

### Application Update Configuration

The application supports auto-updates through `electron-updater`. The update configuration is defined in `dev-app-update.yml`:

```yaml
provider: generic
url: https://example.com/auto-updates
updaterCacheDirName: arbor-desktop-updater
```

## Release Process

1. Update the version in `package.json`
2. Create a git tag for the release
3. Build the application for all platforms
4. Upload the artifacts to the release
5. Update the release notes

### Versioning

Follow semantic versioning (SemVer):
- MAJOR version for incompatible API changes
- MINOR version for backward-compatible functionality
- PATCH version for backward-compatible bug fixes

### Creating a Release

1. Update version in `package.json`
2. Commit changes:
   ```bash
   git commit -am "chore: bump version to vX.Y.Z"
   ```
3. Create and push a tag:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
4. Create a GitHub release with the tag
5. Build and upload artifacts

## Code Signing

For production releases, code signing is recommended to avoid security warnings on Windows and macOS.

### Windows

Set the following environment variables:
- `CSC_LINK` - Path to the certificate
- `CSC_KEY_PASSWORD` - Certificate password

### macOS

Set the following environment variables:
- `CSC_LINK` - Path to the certificate
- `CSC_KEY_PASSWORD` - Certificate password
- `APPLE_ID` - Apple ID for notarization
- `APPLE_APP_SPECIFIC_PASSWORD` - App-specific password

## Distribution

### Windows

The Windows build produces an NSIS installer that provides a standard installation experience.

### macOS

The macOS build produces a DMG file that users can drag to their Applications folder.

### Linux

The Linux build produces an AppImage that can be run directly without installation.

## Auto Updates

The application uses `electron-updater` to provide automatic updates.

### Configuration

The update server URL is configured in `dev-app-update.yml`. For production, this should point to a secure server hosting the update files.

### Update Process

1. The application checks for updates on startup
2. If an update is available, it downloads in the background
3. The update is applied on the next application restart

## Troubleshooting

### Build Issues

1. Ensure all dependencies are installed: `pnpm install`
2. Clear the build cache: `pnpm build --clear-cache`
3. Check for TypeScript errors: `pnpm typecheck`
4. Verify the Electron Builder configuration

### Platform-Specific Issues

#### macOS
- Ensure you have the correct signing certificates
- Check that Xcode command line tools are installed

#### Windows
- Ensure you have the correct signing certificates
- Check that Windows SDK is installed for certain features

#### Linux
- Ensure AppImageLauncher is installed for better AppImage integration

## Performance Considerations

1. Minimize the included files to reduce package size
2. Use compression for assets
3. Optimize images and other media
4. Remove unnecessary dependencies
5. Use tree shaking to eliminate unused code