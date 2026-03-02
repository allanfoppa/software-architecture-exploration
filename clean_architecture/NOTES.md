# Clean Architecture Implementation Notes

## Project Overview

This is a minimalist implementation of Clean Architecture in TypeScript, demonstrating how to structure a real-world application following Uncle Bob's Clean Architecture principles.

## The Four Layers

### 1. Domain (Entities)

- Enterprise-wide business rules
- Domain entities (`User`) with core logic
- Port interfaces (`IUserRepository`) that outer layers must implement
- **No dependencies on any framework**

### 2. Application (Use Cases)

- Application-specific business rules
- Use cases that coordinate domain entities
- DTOs for data transfer across boundaries
- Depends only on domain layer

### 3. Interface Adapters

- Controllers - handle HTTP requests and delegate to use cases
- Presenters - format output from use cases
- Repositories - implement domain ports from outer layer
- Adapts between use cases and external agencies

### 4. Frameworks & Drivers

- Express web framework setup
- Database connections and details
- External service integrations
- Dependency injection configuration

## Key Principle: The Dependency Rule

**Source code dependencies ALWAYS point inward.**

Inner layers never know about outer layers. This ensures:

- Testability (test without frameworks)
- Independence (swap frameworks easily)
- Reusability (domain logic works anywhere)

## Project Structure

```
clean_architecture/
├── src/
│   ├── domain/                  # Entities & Ports
│   ├── application/             # Use Cases & DTOs
│   ├── interface-adapters/      # Controllers, Presenters, Repositories
│   └── frameworks/              # Express & Entry Point
├── tests/                       # Unit & Integration Tests
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Design Patterns Used

1. **Ports & Adapters** - Domain defines interfaces, outer layers implement them
2. **Repository Pattern** - Abstract data access
3. **Dependency Injection** - Inject dependencies at framework level
4. **DTO Pattern** - Simple data holders for crossing boundaries
5. **Controller-Use Case-Presenter** - Clear request/response flow

## Testing Without Frameworks

Test business logic without Express or database:

```typescript
const repository = new InMemoryUserRepository();
const useCase = new CreateUserUseCase(repository);
const response = await useCase.execute(
  new CreateUserRequestDTO("1", "John", "john@example.com"),
);

expect(response.name).toBe("John");
```

## Benefits

✅ Independent of Frameworks - Replace Express anytime
✅ Testable - Business logic testable without UI/DB
✅ Independent of UI - Replace web UI with CLI, mobile, etc.
✅ Independent of Database - Switch from MongoDB to PostgreSQL
✅ Maintainable - Clear structure, easy to understand
✅ Scalable - Grows without major refactoring

## References

- [Uncle Bob's Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
