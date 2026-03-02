# Getting Started with Clean Architecture

## Quick Start

### 1. Install Dependencies

```bash
cd clean_architecture
npm install
```

Or if you use pnpm:

```bash
pnpm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Run Tests

```bash
npm test
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Test the API

**Create a User:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Get All Users:**

```bash
curl http://localhost:3000/users
```

**Get User by ID:**

```bash
curl http://localhost:3000/users/1
```

**Health Check:**

```bash
curl http://localhost:3000/health
```

## Project Layout

```
clean_architecture/
├── src/
│   ├── domain/                    ← Business rules (innermost)
│   │   ├── entities/              ← User entity
│   │   └── ports/                 ← Repository interface
│   ├── application/               ← Use cases
│   │   ├── dtos/                  ← Data Transfer Objects
│   │   └── use-cases/             ← Business logic orchestration
│   ├── interface-adapters/        ← Controller, Presenter, Repository
│   │   ├── controllers/           ← Handle HTTP requests
│   │   ├── presenters/            ← Format output
│   │   └── repositories/          ← Data access implementations
│   └── frameworks/                ← Framework details (outermost)
│       └── express/               ← Express setup
├── tests/                         ← Unit & integration tests
├── README.md                      ← Project overview
├── ARCHITECTURE.md                ← Deep dive into architecture
├── VISUAL_GUIDE.md                ← Diagrams and visual explanations
├── NOTES.md                       ← Implementation notes
└── package.json
```

## Understanding the Architecture

### The Four Layers

1. **Domain Layer** (`src/domain/`)
   - Contains your business rules
   - Independent of any framework
   - No external dependencies
   - Example: `User` entity, `IUserRepository` interface

2. **Application Layer** (`src/application/`)
   - Contains use cases
   - Orchestrates domain entities
   - Defines DTOs for input/output
   - Example: `CreateUserUseCase`

3. **Interface Adapters Layer** (`src/interface-adapters/`)
   - Converts between use cases and external systems
   - Controllers handle HTTP
   - Presenters format output
   - Repositories implement domain ports
   - Example: `UserController`, `UserPresenter`, `InMemoryUserRepository`

4. **Frameworks & Drivers Layer** (`src/frameworks/`)
   - Framework setup and integration
   - All external libraries
   - Dependency injection configuration
   - Example: Express app setup

### The Dependency Rule

**Dependencies always point inward.**

```
Domain ← Application ← Interface Adapters ← Frameworks
```

Inner layers never depend on outer layers. This ensures independence and testability.

## Example: Creating a User

Here's how data flows through the layers:

```
Browser
   ↓
POST /users (HTTP Request)
   ↓
Express Route → UserController.create()  [Frameworks → Interface Adapters]
   ↓
Create CreateUserRequestDTO
   ↓
CreateUserUseCase.execute(dto)            [Interface Adapters → Application]
   ↓
User.create(...)                          [Application → Domain]
   ↓
userRepository.save(user)                 [Application → Interface Adapters]
   ↓
InMemoryUserRepository.save()
   ↓
Return UserResponseDTO                    [Back up through layers]
   ↓
UserPresenter.present(dto)                [Interface Adapters]
   ↓
JSON Response
   ↓
Browser receives response!
```

**Key insight:** Domain layer never knows about HTTP, Express, or the database!

## Testing Examples

### Test Use Case (No Database Needed)

```typescript
// From tests/use-cases.spec.ts
const repository = new InMemoryUserRepository();
const useCase = new CreateUserUseCase(repository);
const response = await useCase.execute(
  new CreateUserRequestDTO("1", "John", "john@example.com"),
);
expect(response.name).toBe("John");
```

### Test Repository

```typescript
// From tests/repository.spec.ts
const repository = new InMemoryUserRepository();
const user = User.create("1", "John", "john@example.com");
await repository.save(user);
const result = await repository.findById("1");
expect(result?.getName()).toBe("John");
```

Fast, reliable tests with no framework overhead!

## Key Files to Understand

Start exploring in this order:

1. **[src/domain/entities/user.entity.ts](src/domain/entities/user.entity.ts)**
   - Simple entity with business logic
   - No framework dependencies

2. **[src/domain/ports/user.repository.port.ts](src/domain/ports/user.repository.port.ts)**
   - Interface that defines the contract
   - What must be implemented by outer layers

3. **[src/application/use-cases/create-user.use-case.ts](src/application/use-cases/create-user.use-case.ts)**
   - Orchestrates domain entities and repository
   - Depends on domain interfaces, not implementations

4. **[src/interface-adapters/controllers/user.controller.ts](src/interface-adapters/controllers/user.controller.ts)**
   - Handles HTTP requests
   - Creates DTOs and calls use cases

5. **[src/frameworks/express/app.ts](src/frameworks/express/app.ts)**
   - Express setup and dependency injection
   - All framework details confined here

## Common Tasks

### Add a New Use Case

1. Create DTOs in `src/application/dtos/`
2. Create use case in `src/application/use-cases/`
3. Add controller method in `src/interface-adapters/controllers/`
4. Add route in `src/frameworks/express/app.ts`
5. Add tests in `tests/`

### Swap the Database

1. Create new repository in `src/interface-adapters/repositories/`
   - Example: `postgres-user.repository.ts`
2. Implement `IUserRepository` interface
3. Update DI in `src/frameworks/express/app.ts`
   - Change: `new InMemoryUserRepository()`
   - To: `new PostgresUserRepository()`

**Domain and application layers? No changes needed!**

### Add Request Validation

1. Create validator in `src/application/`
2. Call it in controller before creating DTO
3. Return 400 Bad Request if validation fails

### Add Authentication

1. Add auth middleware in `src/frameworks/express/app.ts`
2. Extract user from request in controller
3. Pass user context to use case

## Next Steps

1. **Read the documentation:**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Deep dive
   - [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Diagrams

2. **Run the tests:**

   ```bash
   npm test:watch
   ```

   Watch the tests pass as you explore the code!

3. **Extend the project:**
   - Add a `DeleteUserUseCase`
   - Add a `FindUserByEmailUseCase`
   - Add a database repository
   - Add request validation

4. **Study the patterns:**
   - Dependency Inversion Principle
   - Repository Pattern
   - DTO Pattern
   - Adapter Pattern

## Troubleshooting

### "Cannot find module" errors

Make sure you ran:

```bash
npm install
```

### Tests failing

Try rebuilding:

```bash
npm run build
npm test
```

### Port 3000 already in use

Change the port:

```bash
PORT=3001 npm run dev
```

### TypeScript compilation errors

Make sure tsconfig.json is set up correctly:

```bash
npm run build
```

## Learning Resources

- [Uncle Bob's Clean Architecture Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Code - Uncle Bob](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)

## Support

For questions about the implementation, check:

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed explanations
- [NOTES.md](NOTES.md) - Implementation decisions
- [VISUAL_GUIDE.md](VISUAL_GUIDE.md) - Visual diagrams
- Test files for practical examples

Good luck! 🚀
