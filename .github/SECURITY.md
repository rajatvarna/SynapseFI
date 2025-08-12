# Security Policy

## Reporting a Vulnerability

Please report any security vulnerabilities by opening an issue in this repository.

## Known Vulnerabilities

As of August 2025, the following vulnerabilities are known to exist in the project's dependencies.

### `webpack-dev-server` (Moderate)

-   **Vulnerability IDs:** [GHSA-9jgg-88mc-972h](https://github.com/advisories/GHSA-9jgg-88mc-972h), [GHSA-4v9v-hfq4-rm2v](https://github.com/advisories/GHSA-4v9v-hfq4-rm2v)
-   **Dependency:** `webpack-dev-server` (a sub-dependency of `@docusaurus/core`)
-   **Severity:** Moderate
-   **Impact:** These vulnerabilities affect the local development server only. They do not pose a risk to the production application.
-   **Status:** **Not fixed.** The project is currently using the latest available version of Docusaurus (`3.8.1`). A fix requires an upstream update from the Docusaurus team. We are monitoring the Docusaurus project for a new release that resolves this issue.
