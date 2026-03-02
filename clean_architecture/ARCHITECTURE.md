# Clean Architecture Deep Dive

This document provides an in-depth explanation of Clean Architecture and how it's implemented in this project.

## What is Clean Architecture?

Clean Architecture is an architectural pattern that emphasizes:

1. **Separation of concerns** - dividing software into layers with specific responsibilities
2. **Independence from frameworks** - business logic doesn't depend on web frameworks or databases
3. **Testability** - core business rules can be tested without external dependencies
4. **Flexibility** - easy to change external details (UI, database, etc.)

## The Four Layers Explained

### Layer 1: Domain (Enterprise Business Rules)

**Location**: `src/domain/`

**Responsibility**: Contains the core business logic that applies across the entire enterprise.

**Components**:

- **Entities**: Objects that contain enterprise-wide business rules
  - Example: `User` entity with business logic for user management
  - Entities have a long lifespan and are reusable across projects
  - No dependencies on frameworks or databases

**Code Example**:

```typescript
export class User {
  static create(id: string, name: string, email: string): User {
    return new User({
      id,
      name,
      email,
      createdAt: new Date(),
    });
  }
}
```

- **Ports**: Interfaces that define contracts for external dependencies
  - Example: `IUserRepository` - defines how users should be persisted
  - The domain defines what needs to be done (contract)
  - The implementation is left to the outer layers

**Code Example**:

```typescript
export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
```

**Independence**: The domain layer has ZERO dependencies on frameworks, databases, or UI concerns.

---

### Layer 2: Application (Application Business Rules)

**Location**: `src/application/`

**Responsibility**: Contains application-specific business rules that coordinate the domain entities and external systems.

**Components**:

- **Use Cases**: The orchestrators of your application
  - Each use case implements a specific user story
  - Receives input through Request DTOs
  - Commands domain entities and repositories
  - Returns output through Response DTOs

**Code Example**:

```typescript
export class CreateUserUseCase {
  async execute(request: CreateUserRequestDTO): Promise<UserResponseDTO> {
    // Business logic: How do we create a user?
    const user = User.create(request.id, request.name, request.email);

    // Persist the user
    await this.userRepository.save(user);

    // Return result
    return new UserResponseDTO(...);
  }
}
```

- **DTOs (Data Transfer Objects)**: Simple data holders for crossing layer boundaries
  - `Request DTOs`: Input to use cases from controllers
  - `Response DTOs`: Output from use cases to presenters
  - Contains no business logic, just data

**Code Example**:

```typescript
export class CreateUserRequestDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
  ) {}
}
```

**Key Points**:

- Use cases depend on domain entities and interfaces (ports)
- Use cases have NO knowledge of:
  - HTTP/Express
  - Database technology
  - UI framework
  - Any external framework detail

---

### Layer 3: Interface Adapters (Adapters & Gateways)

**Location**: `src/interface-adapters/`

**Responsibility**: Converts data between the format convenient for use cases and the format convenient for external agencies.

**Components**:

- **Controllers**: Handle HTTP requests, delegate to use cases
  - Receives request data from HTTP
  - Creates Request DTOs
  - Calls use cases
  - Hands result DTO to presenter
  - Is NOT responsible for business logic

**Code Example**:

```typescript
async create(req: Request, res: Response): Promise<void> {
  const { id, name, email } = req.body;
  const request = new CreateUserRequestDTO(id, name, email);
  const response = await this.createUserUseCase.execute(request);
  res.status(201).json(this.userPresenter.present(response));
}
```

- **Presenters**: Convert DTOs to output format
  - Formats data for the web (JSON, etc.)
  - Implements interfaces expected by use cases
  - Handles data formatting/transformation
  - No business logic

**Code Example**:

```typescript
present(response: UserResponseDTO): Record<string, unknown> {
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    createdAt: response.createdAt.toISOString(),
  };
}
```

- **Repository Implementations**: Realize the domain port interfaces
  - Uses any data storage mechanism (database, file system, etc.)
  - Implements `IUserRepository` port
  - Isolates database code in one place

**Code Example**:

```typescript
export class InMemoryUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
  }
}
```

**Why This Layer?**

- Acts as a bridge between inner and outer layers
- Ensures the Dependency Rule is maintained
- Provides a single place to swap implementations
- Could implement multiple repositories: SQL, NoSQL, File System, etc.

---

### Layer 4: Frameworks & Drivers (Details)

**Location**: `src/frameworks/`

**Responsibility**: Contains framework setup and integration code.

**Components**:

- **Express App Setup**: Framework initialization
  - Route definitions
  - Middleware configuration
  - Dependency injection setup

**Code Example**:

```typescript
const app = express();
app.use(express.json());
app.post("/users", (req, res) => userController.create(req, res));
```

**Key Points**:

- Minimal code - mostly glue
- Easy to replace (swap Express for Fastify, for example)
- All framework details confined here
- NO business logic

---

## The Dependency Rule Visualized

```
┌─────────────────────────────────────────┐
│      FRAMEWORKS & DRIVERS (Outer)       │
│  • Express, Database, External APIs     │
└──────────────┬──────────────────────────┘
               │ depends on ↓
┌──────────────┴───────────────────────────┐
│    INTERFACE ADAPTERS (Middle-Outer)     │
│  • Controllers, Presenters, Repositories │
└──────────────┬──────────────────────────┘
               │ depends on ↓
┌──────────────┴───────────────────────────┐
│ APPLICATION (Middle-Inner)               │
│  • Use Cases, DTOs                       │
└──────────────┬──────────────────────────┘
               │ depends on ↓
┌──────────────┴───────────────────────────┐
│ DOMAIN (Inner)                           │
│  • Entities, Ports/Interfaces            │
│  • NO DEPENDENCIES ON ANYTHING           │
└─────────────────────────────────────────┘
```

**The Rule**: Dependencies ALWAYS point inward. Inner layers never know about outer layers.

---

## Flow of Control vs. Dependencies

Here's what's interesting about Clean Architecture: **the flow of control is different from the dependency direction**.

### Example: Creating a User

**Flow of Control** (top to bottom):

```
HTTP Request
    ↓
Controller.create()
    ↓
CreateUserUseCase.execute()
    ↓
UserRepository.save()
    ↓
Domain Entity Operation
```

**Dependencies** (still pointing inward):

```
Controller → depends on → CreateUserUseCase
CreateUserUseCase → depends on → IUserRepository (interface)
IUserRepository ← implemented by ← UserRepository

CreateUserUseCase → depends on → User (entity)
UserRepository → depends on → User (entity)
```

### How This Works: Dependency Inversion

The use case needs to call the repository (flow of control goes down), but the use case shouldn't depend on a concrete repository class. Instead:

1. The use case depends on an **interface** (port): `IUserRepository`
2. The concrete repository **implements** this interface
3. At runtime, the concrete implementation is **injected** into the use case
4. This way, the dependency points inward, even though control flows outward

This is polymorphism at work!

---

## Why This Matters

### Example: Swapping Out the Database

**Traditional Architecture:**

```typescript
class UserController {
  userService: MySQLUserService; // Depends on MySQL!
}
```

Changing to PostgreSQL requires changing the controller.

**Clean Architecture:**

```typescript
class UserController {
  userRepository: IUserRepository; // Depends only on interface!
}
```

Changing to PostgreSQL only requires creating a new `PostgreSQLUserRepository` that implements `IUserRepository`.

---

## Testing Benefits

### Test a Use Case Without Any Framework

```typescript
// No Express needed
// No Database needed
// Just pure business logic

const repository = new InMemoryUserRepository();
const useCase = new CreateUserUseCase(repository);
const response = await useCase.execute(
  new CreateUserRequestDTO("1", "John", "john@example.com"),
);

expect(response.name).toBe("John");
```

This is incredibly powerful for:

- **Fast tests**: No I/O, database calls, or framework overhead
- **Reliable tests**: No flaky network calls
- **Clear tests**: Tests show intent without framework noise

---

## Design Decisions in This Project

### 1. No Database Framework

We use an in-memory repository to keep the project minimal. In a real project, you'd add:

- TypeORM repository for SQL databases
- Prisma repository for better type safety
- MongoDB repository for NoSQL

The domain and application layers never change.

### 2. Dependency Injection

Dependencies are created in the outermost layer:

```typescript
const userRepository = new InMemoryUserRepository();
const useCase = new CreateUserUseCase(userRepository);
```

This could be replaced with a DI container like `Inversify` or `NestJS` DI system.

### 3. DTOs vs. Entities

- Entities are for business logic (domain layer)
- DTOs are for data transfer (boundaries between layers)
- They're different for a reason - flexibility and independence

---

## How to Extend This Project

### Adding a New Feature: Delete User

**Step 1: Domain** (might not change for delete - just delete from storage)

```typescript
// IUserRepository already has:
delete(id: string): Promise<void>;
```

**Step 2: Application** (create the use case)

```typescript
export class DeleteUserUseCase {
  async execute(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```

**Step 3: Interface Adapters** (create controller method)

```typescript
async delete(req: Request, res: Response): Promise<void> {
  await this.deleteUserUseCase.execute(req.params.id);
  res.status(204).send();
}
```

**Step 4: Frameworks** (add route)

```typescript
app.delete("/users/:id", (req, res) => userController.delete(req, res));
```

Notice how the domain layer didn't change? That's the beauty of Clean Architecture.

---

## Anti-patterns to Avoid

### ❌ Don't: Make Use Cases Depend on Controllers

```typescript
// WRONG!
export class CreateUserUseCase {
  async execute(controller: UserController) {}
}
```

### ✅ Do: Make Controllers Depend on Use Cases

```typescript
// RIGHT!
export class UserController {
  constructor(private useCase: CreateUserUseCase) {}
}
```

### ❌ Don't: Put Database Code in Domain

```typescript
// WRONG!
export class User {
  save() {
    database.query("INSERT INTO users...");
  }
}
```

### ✅ Do: Keep Domain Pure

```typescript
// RIGHT!
export class User {
  // Just business logic
}

// In repository:
async save(user: User): Promise<void> {
  database.query('INSERT INTO users...');
}
```

### ❌ Don't: Use Database-specific Entities in Controllers

```typescript
// WRONG!
const dbUser = await database.query("SELECT * FROM users");
res.json(dbUser); // Returns raw database row
```

### ✅ Do: Convert to DTOs/Response Objects

```typescript
// RIGHT!
const user = await userRepository.findById(id);
const response = new UserResponseDTO(user.getId(), user.getName(), ...);
res.json(presenter.present(response));
```

---

## Summary

Clean Architecture is about:

1. **Organization**: Layers with clear responsibilities
2. **Independence**: Inner layers independent of outer layers
3. **Testability**: Business logic testable without framework
4. **Flexibility**: Easy to swap components
5. **Maintainability**: Clear structure, easy to understand and modify

The four layers work together:

- **Domain**: What your business does
- **Application**: How your application uses the domain
- **Interface Adapters**: How external systems communicate with your application
- **Frameworks**: The tools you use

By following the Dependency Rule (dependencies point inward), you create a system that's resilient to change and easy to test.
