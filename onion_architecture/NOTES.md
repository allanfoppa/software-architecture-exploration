# Onion Architecture

## Overview

This project demonstrates the **Onion Architecture** pattern, a layered architectural approach that emphasizes the independence of the business logic from external concerns like frameworks, databases, and user interfaces.

## Architecture Layers

### Domain Layer (`core/domain/`)

- **Purpose**: Contains the core business logic and domain models
- **Contents**:
  - `entities/`: Domain entities (e.g., `user.entity.ts`)
  - `ports/`: Interfaces/contracts that define how the domain interacts with external systems (e.g., `user.repository.port.ts`)
- **Dependencies**: No dependencies on other layers
- **Key Principle**: Pure business logic, agnostic to implementation details

### Application Layer (`core/application/`)

- **Purpose**: Orchestrates use cases and business workflows
- **Contents**:
  - `use-cases/`: Application-specific business logic (e.g., `register-user.use-case.ts`)
  - `ports/`: Application-level contracts if needed
- **Dependencies**: Depends on Domain Layer only
- **Key Principle**: Coordinates domain objects to implement user stories

### Infrastructure Layer (`infrastructure/`)

- **Purpose**: Implements external concerns and integration points
- **Contents**:
  - `persistence/`: Database implementations (e.g., `prisma-user.repository.ts`)
  - `http/`: HTTP controllers and DTOs (API entrypoints live under `infrastructure/http/`)
  - `config/`: Configuration and setup
- **Dependencies**: Depends on Domain and Application layers
- **Key Principle**: All implementation details live here (database, HTTP framework, etc.)

### Presentation Layer (`presentation/web/`)

- **Purpose**: User interface
- **Contents**:
  - Web application UI (under `presentation/web/`)
  - Presentation-specific wiring that depends on infrastructure
- **Dependencies**: Depends on inner layers
- **Key Principle**: Layer that is responsible to show to user all the information

## Project Structure

```
onion_architecture/
├── core/
│ ├── domain/
│ │ ├── entities/
│ │ │ └── user.entity.ts (Domain model)
│ │ ├── ports/
│ │ | └── user.repository.port.ts (Repository interface)
│ ├── application/
│ | ├── use-cases/
│ |   └── register-user.input.ts (Use case input)
│ |   └── register-user.use-case.ts (Use case implementation)
| ├── infrastructure/
│ | ├── persistence/
│ │   └── prisma-user.repository.ts (Implementation)
│ | ├── http/
│ |   ├── user.controller.ts (API endpoint)
│ |   ├── user.module.ts (Module definition)
│ |   ├── dto/
│ |   |  └── create-user.request.dto.ts (Input validation)
│ |   |  └── create-user.response.dto.ts (Response structure)
| ├── presentation/
│ |   ├── web/
│ |   |  └── index.html (Web UI)
| ├── tests/
│ |   └── jest.config.ts
│ |   ├── core/
│ |   |  ├── application/
│ |   |  |  ├── use-cases/
│ |   |  |  |  └── register-user.use-case.spec.ts

```

## Naming Conventions

### File Naming

- **Entities**: `{name}.entity.ts` (e.g., `user.entity.ts`)
- **Port/Interface**: `{name}.repository.port.ts` (e.g., `user.repository.port.ts`)
- **Implementations**: `{provider}-{name}.repository.ts` (e.g., `prisma-user.repository.ts`)
- **Use Cases**: `{action}-{entity}.use-case.ts` (e.g., `register-user.use-case.ts`)
- **Use Case Input**: `{action}-{entity}.input.ts` (e.g., `register-user.input.ts`)
- **DTOs**: `{action}-{entity}.{type}.dto.ts` (e.g., `create-user.request.dto.ts`)
- **Tests**: `{name}.spec.ts` (e.g., `register-user.use-case.spec.ts`)

## Data Flow

### User Registration Flow

```
Controller (HTTP layer)
↓
RegisterUserUseCase (Application layer)
↓ (transforms input to entity)
UserRepository.save() (Domain port, Infrastructure implementation)
↓
Prisma/Database (External system)

```

### Complete Request/Response Cycle

1. **Request**: `POST /users` with `CreateUserRequestDto`
2. **Controller**: Validates input and calls use case
3. **Use Case**:
   - Generates unique ID
   - Creates `User` entity from input
   - Calls repository to persist
   - Returns created user
4. **Response**: `CreateUserResponseDto` with user details and success message

## Key Principles Applied

### 1. Framework Agnosticism

- **Core package has zero dependencies** (no dev dependencies, no framework coupling)
- Testing and build tools are managed at the root monorepo level only
- Core layer is completely independent and can be published/used without any toolchain
- No Jest, TypeScript compiler, or framework installed in the core package itself
- This ensures the domain logic is truly portable and reusable

### 2. Dependency Inversion

- Domain layer defines ports (interfaces)
- Infrastructure layer implements ports
- Application layer depends on abstractions, not concrete implementations

### 3. Separation of Concerns

- Domain: Business logic
- Application: Workflows and orchestration
- Infrastructure: External system implementations
- Presentation: User interaction

### 4. Testability

- Use cases are tested with mocked repositories
- No external dependencies needed for unit tests
- Easy to swap implementations (mock vs. real database)

### 5. Maintainability

- Clear layer responsibilities
- Easy to locate related code
- Changes to one layer don't require changes to others

## Adding New Features

### Example: Add Authentication

1. **Domain Layer**:
   - Create `authentication.port.ts` interface
   - Create `user-authentication.use-case.ts`

2. **Application Layer**:
   - Implement authentication logic
   - Handle JWT tokens or sessions

3. **Infrastructure Layer**:
   - Implement authentication port (e.g., with JWT library)
   - Add authentication middleware

4. **Presentation Layer**:
   - Add login/logout endpoints
   - Add authentication guards

## References

- [Jeffrey Palermo's Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
