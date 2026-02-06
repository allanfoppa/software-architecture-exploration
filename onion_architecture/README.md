# Onion Architecture Example

A practical implementation of **Onion Architecture** demonstrating best practices for layered application design, dependency injection, and separation of concerns.

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Navigate to API app
cd apps/api

# Install API dependencies
pnpm install
```

### Running the Application

```bash
# From apps/api directory
pnpm run start

# The API will be available at http://localhost:3000
```

### Running Tests

```bash
# From root directory (run all tests)
pnpm run test

# Or specifically test the use case
cd packages/core
pnpm run test
```

## API Endpoints

### Create User

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response** (201):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "User created successfully"
}
```

## Project Structure

See [NOTES.md](./NOTES.md) for detailed architecture documentation.

```
.
├── packages/
│   └── core/                    # Shared business logic
│       ├── domain/              # Domain entities and ports
│       └── application/         # Use cases
├── apps/
│   ├── api/                     # NestJS API application
│   │   └── src/
│   │       ├── infrastructure/  # Repositories, HTTP layer
│   │       ├── app.module.ts
│   │       └── main.ts
│   └── web/                     # Web frontend
└── NOTES.md                     # Architecture documentation
```

## Architecture Highlights

### Layers (Core to Outer)

1. **Domain Layer** - Pure business logic, no framework dependencies
2. **Application Layer** - Use cases and business workflows
3. **Infrastructure Layer** - Database, HTTP, external services
4. **Presentation Layer** - UI layer

### Key Features

✅ Dependency Inversion - Depend on abstractions, not implementations
✅ Separation of Concerns - Each layer has clear responsibility
✅ Testability - Easy to test without external dependencies
✅ Maintainability - Clear code organization and naming conventions
✅ Scalability - Easy to add new features without changing existing code

## Development

### File Naming Conventions

- Entities: `{name}.entity.ts`
- Ports: `{name}.repository.port.ts`
- Implementations: `{provider}-{name}.repository.ts`
- Use Cases: `{action}-{entity}.use-case.ts`
- DTOs: `{action}-{entity}.{type}.dto.ts`
- Tests: `{name}.spec.ts`

### Adding a New Feature

1. Create domain entity in `packages/core/domain/entities/`
2. Create port interface in `packages/core/domain/ports/`
3. Create use case in `packages/core/application/use-cases/`
4. Implement port in `apps/api/src/infrastructure/`
5. Create controller in `apps/api/src/infrastructure/http/`
6. Write tests alongside the code

## Best Practices

- Domain layer should have ZERO external dependencies
- Application layer depends only on domain layer
- Infrastructure implements domain ports/interfaces
- Always use dependency injection for loose coupling
- Write tests before or alongside implementation
- Use typed DTOs for all input/output

## Troubleshooting

### Port already in use

The API defaults to port 3000. Change it in `apps/api/src/main.ts`:

```typescript
await app.listen(3001); // Use different port
```

### Module not found errors

Ensure all path aliases in `tsconfig.json` match across the monorepo.

## Learning Resources

- [Onion Architecture - Jeffrey Palermo](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## License

MIT
