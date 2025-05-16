# Contributing to iconiq

Thank you for your interest in contributing to iconiq! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js v22.15.0 or later (see `.nvmrc`)
- pnpm v10.11.0 or later

### Setting Up the Development Environment

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the packages:
   ```bash
   pnpm build
   ```

## Development Workflow

### Project Structure

```
iconiq/
├── packages/
│   ├── shared/        # Shared utilities and type definitions
│   ├── iconiq/        # Core icon definitions
│   └── iconiq-react/  # React components
├── icons/             # Icon definitions (JSON)
├── tools/             # Build tooling
└── scripts/           # Helper scripts
```

### Working with Icons

Icons are defined using JSON files in the `icons/` directory. Each icon should:

1. Follow the schema defined in `icon.schema.json`
2. Include all required variants (outline, filled, sharp)
3. Include proper accessibility labels

Example icon definition:

```json
{
  "name": "example-icon",
  "a11yLabel": "Description of the icon for screen readers",
  "tags": ["category", "descriptor"],
  "categories": ["ui"],
  "variants": {
    "outline": {
      "path": "M12 4v16m-8-8h16"
    },
    "filled": {
      "path": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
    },
    "sharp": {
      "path": "M10 4h4v16h-4V4z"
    }
  }
}
```

### Building and Testing

- Build all packages: `pnpm build`
- Build icons: `pnpm build:icons`
- Generate React components: `pnpm generate:react`
- Run tests: `pnpm test`

### Code Style

This project uses:

- ESLint for linting
- Prettier for code formatting
- TypeScript for static type checking

Ensure your code passes all checks:

```bash
pnpm lint
pnpm format:check
```

## Pull Request Guidelines

1. Create a feature branch from `main`
2. Make your changes following the coding style
3. Add or update tests as necessary
4. Ensure all tests pass
5. Update documentation as needed
6. Submit a PR with a clear title and description

## Adding New Icons

1. Create a JSON file in the `icons/` directory with the icon name (kebab-case)
2. Define all required properties according to the schema
3. Run validation: `pnpm validate:icons`
4. Build the icons: `pnpm build:icons`
5. Test the new icon in the preview app: `pnpm dev`

## License

By contributing to iconiq, you agree that your contributions will be licensed under the project's MIT license.
