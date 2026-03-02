# Clean Architecture with TypeScript

A minimalist implementation of Clean Architecture principles as described by Uncle Bob (Robert C. Martin).

## Project Overview

This project demonstrates how to structure a TypeScript application following Clean Architecture principles. It's a simple user management system that showcases the separation of concerns and dependency inversion.

## Architecture Layers

The project is organized into four concentric layers, from innermost to outermost:

### 1. **Domain Layer** (`src/domain/`)

The innermost layer containing enterprise business rules.

- **Entities**: Core business objects (e.g., `User`)
- **Ports**: Interfaces/contracts that must be fulfilled by outer layers (e.g., `IUserRepository`)

**Key principle**: The domain layer is completely independent of any framework or external concern.

### 2. **Application Layer** (`src/application/`)

Contains application-specific business rules and use cases.

- **Use Cases**: Orchestrate the flow of data to and from entities (e.g., `CreateUserUseCase`)
- **DTOs**: Data Transfer Objects for input/output (e.g., `CreateUserRequestDTO`)

**Key principle**: Use cases depend on domain entities but not on frameworks.

### 3. **Interface Adapters Layer** (`src/interface-adapters/`)

Converts data between the format most convenient for use cases and the format most convenient for external agencies.

- **Controllers**: Handle HTTP requests and delegate to use cases
- **Presenters**: Convert use case outputs to API format
- **Repositories**: Implement domain port interfaces

**Key principle**: This layer bridges the gap between the application and external systems.

### 4. **Frameworks & Drivers Layer** (`src/frameworks/`)

The outermost layer containing framework details and tools.

- **Express**: Web framework
- **Database**: Persistence mechanisms

**Key principle**: Framework details are isolated here. The inner layers don't know about Express or any specific database.

## The Dependency Rule

**Source code dependencies can only point inward.**

- Outer circles depend on inner circles
- Inner circles have no knowledge of outer circles
- This ensures testability and maintainability

## Project Structure

```
clean_architecture/
├── src/
│   ├── domain/                           # Enterprise business rules
│   │   ├── entities/
│   │   │   └── user.entity.ts           # User entity
│   │   ├── ports/
│   │   │   └── user.repository.port.ts  # Repository interface
│   │   └── index.ts
│   ├── application/                      # Application business rules
│   │   ├── dtos/
│   │   │   └── user.dto.ts              # Data Transfer Objects
│   │   ├── use-cases/
│   │   │   ├── create-user.use-case.ts
│   │   │   ├── find-all-users.use-case.ts
│   │   │   └── find-user-by-id.use-case.ts
│   │   └── index.ts
│   ├── interface-adapters/              # Adapters & converters
│   │   ├── controllers/
│   │   │   └── user.controller.ts
│   │   ├── presenters/
│   │   │   └── user.presenter.ts
│   │   ├── repositories/
│   │   │   └── in-memory-user.repository.ts
│   │   └── index.ts
│   └── frameworks/                      # Framework details
│       └── express/
│           ├── app.ts                   # Express app setup
│           └── server.ts                # Server entry point
├── tests/                               # Unit & integration tests
│   ├── use-cases.spec.ts
│   └── repository.spec.ts
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Installation

```bash
npm install
# or
pnpm install
```

## Scripts

```bash
# Build the project
npm run build

# Start the server
npm start

# Development mode with auto-reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## API Endpoints

### Create User

```
POST /users
Content-Type: application/json

{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Get All Users

```
GET /users
```

### Get User by ID

```
GET /users/:id
```

### Health Check

```
GET /health
```

## Key Design Principles

### 1. Dependency Inversion Principle

- Use cases depend on interfaces (ports) defined in the domain layer
- Repository implementations are provided at runtime through dependency injection

### 2. Single Responsibility Principle

- Each class has one reason to change
- Controllers handle HTTP, use cases handle business logic, repositories handle persistence

### 3. Separation of Concerns

- Domain logic is completely isolated from framework details
- Business rules can be tested without mocking the framework

### 4. Testability

- All business logic can be tested without the web server
- Dependencies are injected, making tests easy to write

## Example: Creating a User

1. **Controller** (Frameworks Layer) receives HTTP request
2. **Controller** creates a Request DTO and calls the **Use Case**
3. **Use Case** (Application Layer) orchestrates the flow
4. **Use Case** calls the **Repository** (Interface Adapter) to persist
5. **Repository** uses a **Domain Entity** to represent the user
6. **Use Case** returns a Response DTO
7. **Presenter** converts the DTO to JSON format
8. **Controller** sends the JSON response back

This flow ensures that:

- Domain layer never knows about HTTP or JSON
- Application layer never knows about Express
- Interface adapter layer handles all conversions
- Each layer is testable in isolation

## Testing Examples

### Unit Test: Repository

```typescript
const repository = new InMemoryUserRepository();
const user = User.create("1", "John", "john@example.com");
await repository.save(user);
const result = await repository.findById("1");
```

### Unit Test: Use Case

```typescript
const repository = new InMemoryUserRepository();
const useCase = new CreateUserUseCase(repository);
const response = await useCase.execute(
  new CreateUserRequestDTO("1", "John", "john@example.com"),
);
```

No mocking, no framework dependencies, just pure business logic!

## Benefits of This Architecture

✅ **Independent of Frameworks**: Swap Express for any other framework
✅ **Testable**: All business rules can be tested without UI/DB
✅ **Maintainable**: Clear separation of concerns
✅ **Flexible**: Easy to add new repositories or presenters
✅ **Scalable**: Can grow without major refactoring
✅ **Enterprise Ready**: Follows industry best practices

## References

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [The Dependency Rule](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html#the-dependency-rule)
- [Clean Code Principles](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

## License

MIT
