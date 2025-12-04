# Release Workflow

Nexus uses GitHub Actions to automate the release process. When a **Pull Request is merged** into the `main` branch, the workflow will automatically build the application and create a release.

## How it Works

1.  **Merge Pull Request**: Merge a PR into the `main` branch.
2.  **Automated Build**: GitHub Actions will trigger the `Release` workflow.
3.  **Version Extraction**: The workflow reads the version from `package.json` (e.g., `1.0.1`).
4.  **Create Release**: It creates a GitHub Release tagged with that version (e.g., `v1.0.1`).
5.  **Artifacts**: The installers (`.exe`, `.dmg`, etc.) are uploaded to this release.

## Important Note

Ensure you have updated the `version` in `package.json` **before** merging the Pull Request. If you merge multiple PRs with the same version, the release step might fail or overwrite artifacts.

## Troubleshooting

-   **Workflow Fails**: Check the "Actions" tab in your GitHub repository to see the logs.
-   **Missing Artifacts**: Ensure `npm run dist` is generating the expected files in the `dist/` directory.
