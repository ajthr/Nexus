# Packaging Nexus

Nexus uses `electron-builder` to package the application for distribution on Linux, macOS, and Windows.

## Prerequisites

-   Ensure you have installed all dependencies:
    ```bash
    npm install
    ```

## Building for Production

To create a distributable package for your current operating system, run:

```bash
npm run dist
```

This command will:
1.  Build the Vite frontend (React).
2.  Package the Electron application.
3.  Output the installers/executables to the `dist` directory.

## Cross-Platform Building

To build for specific platforms (may require specific OS environments or Docker):

-   **Windows**: `npm run dist -- --win`
-   **macOS**: `npm run dist -- --mac`
-   **Linux**: `npm run dist -- --linux`

## Configuration

Packaging configuration is located in `package.json` under the `build` key. You can customize:
-   `appId`: The unique application ID.
-   `productName`: The name of the application.
-   `directories`: Output directories.
-   Platform-specific settings (`win`, `mac`, `linux`).
