# PNPM Workspaces Guide

This repository uses **pnpm workspaces** to manage four distinct packages:

- `@onion/core` — Domain and application logic (framework-agnostic)
- `@onion/infrastructure` — HTTP controllers, adapters, persistence
- `@onion/presentation` — Web UI and presentation layer
- `tests` — Shared testing configuration

## Install Dependencies for Each Workspace

### Core Workspace

```bash
pnpm --filter @onion/core install
```

### Infrastructure Workspace

```bash
pnpm --filter @onion/infrastructure install
```

### Presentation Workspace

```bash
pnpm --filter @onion/presentation install
```

### Tests Workspace

```bash
pnpm --filter tests install
```

## Install Dependencies for Multiple Workspaces

Install for `core` and `infrastructure`:

```bash
pnpm --filter @onion/core --filter @onion/infrastructure install
```

Install for all workspaces:

```bash
pnpm install
```

## Add a Package to a Specific Workspace

Add to `core`:

```bash
pnpm --filter @onion/core add <package-name>
pnpm --filter @onion/core add <package-name> --save-dev
```

Add to `infrastructure/http`:

```bash
pnpm --filter @onion/http add <package-name>
pnpm --filter @onion/http add <package-name> --save-dev
```

Add to `presentation`:

```bash
pnpm --filter @onion/presentation add <package-name>
pnpm --filter @onion/presentation add <package-name> --save-dev
```

Add to `tests`:

```bash
pnpm --filter tests add <package-name>
pnpm --filter tests add <package-name> --save-dev
```

## View Workspace Structure

List all packages and their dependencies:

```bash
pnpm list --depth -1
```

List dependencies for a specific workspace:

```bash
pnpm --filter @onion/core list
pnpm --filter @onion/infrastructure list
pnpm --filter @onion/presentation list
pnpm --filter tests list
```

## Run Scripts in a Workspace

Run a script in a specific workspace:

```bash
pnpm --filter @onion/core build
pnpm --filter tests test
pnpm --filter @onion/presentation dev
```

Run a script across all workspaces:

```bash
pnpm -r build  # -r = recursive (all packages)
```

## Workspace Dependencies

Reference another workspace package using the `workspace:` protocol in `package.json`:

```json
{
  "dependencies": {
    "@onion/core": "workspace:^1.0.0"
  }
}
```

This ensures pnpm automatically links local packages instead of fetching from npm.

## Notes

It's difficult to configure the project so that the main files and subdirectories are well synchronised. This creates a complex environment.

This could be a significant challenging for an inexperienced team.
