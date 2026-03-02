# Visual Architecture Guide

## Clean Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                   FRAMEWORKS & DRIVERS (Outermost)                  │
│                   Express, Database, External APIs                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Framework Configuration, Routing, Middleware, Glue Code      │  │
│  │ src/frameworks/express/                                      │  │
│  └────────────────────┬─────────────────────────────────────────┘  │
│                       │ depends on                                  │
│  ┌────────────────────▼─────────────────────────────────────────┐  │
│  │        INTERFACE ADAPTERS (Interface Layer)                  │  │
│  │                                                              │  │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Controllers    │  │  Presenters  │  │ Repositories │   │  │
│  │  │                 │  │              │  │              │   │  │
│  │  │ • Handle HTTP   │  │ • Format     │  │ • Implement  │   │  │
│  │  │ • Create DTOs   │  │   output     │  │   IUserRepo  │   │  │
│  │  │ • Call UseCases │  │ • Convert    │  │ • Abstract   │   │  │
│  │  │                 │  │   to JSON    │  │   database   │   │  │
│  │  └────────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                              │  │
│  │  src/interface-adapters/                                    │  │
│  └────────────────────┬─────────────────────────────────────────┘  │
│                       │ depends on                                  │
│  ┌────────────────────▼─────────────────────────────────────────┐  │
│  │         APPLICATION LAYER (Use Cases Layer)                  │  │
│  │                                                              │  │
│  │  ┌───────────────────┐  ┌────────────────────────────────┐  │  │
│  │  │  Use Cases        │  │  DTOs                          │  │  │
│  │  │                   │  │                                │  │  │
│  │  │ • CreateUser      │  │ • CreateUserRequestDTO        │  │  │
│  │  │ • FindAllUsers    │  │ • UserResponseDTO             │  │  │
│  │  │ • FindUserById    │  │ • Simple data containers      │  │  │
│  │  │                   │  │ • No business logic           │  │  │
│  │  │ Application-      │  │                                │  │  │
│  │  │ specific rules    │  │                                │  │  │
│  │  └───────────────────┘  └────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  src/application/                                            │  │
│  └────────────────────┬─────────────────────────────────────────┘  │
│                       │ depends on                                  │
│  ┌────────────────────▼─────────────────────────────────────────┐  │
│  │           DOMAIN LAYER (Enterprise Layer - Innermost)       │  │
│  │                                                              │  │
│  │  ┌──────────────────┐    ┌──────────────────────────────┐  │  │
│  │  │  Entities        │    │  Ports (Interfaces)          │  │  │
│  │  │                  │    │                              │  │  │
│  │  │  • User          │    │  • IUserRepository           │  │  │
│  │  │  • Business      │    │  • Contracts that outer     │  │  │
│  │  │    logic only    │    │    layers must fulfill      │  │  │
│  │  │  • No framework  │    │  • Abstraction of external   │  │  │
│  │  │    dependencies  │    │    dependencies              │  │  │
│  │  └──────────────────┘    └──────────────────────────────┘  │  │
│  │                                                              │  │
│  │  Enterprise-wide business rules                             │  │
│  │  NO DEPENDENCIES ON ANYTHING ELSE                           │  │
│  │  src/domain/                                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Flow of a Request

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. HTTP POST /users                                             │
│    { "id": "1", "name": "John", "email": "john@example.com" }   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼  Router matches and invokes
┌─────────────────────────────────────────────────────────────────┐
│ 2. UserController.create(req, res)              [FRAMEWORKS]    │
│    • Extracts data from request body                            │
│    • Creates CreateUserRequestDTO                              │
│    • Calls createUserUseCase.execute(dto)                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (use case execution)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. CreateUserUseCase.execute(request)        [APPLICATION]     │
│    • Receives CreateUserRequestDTO                             │
│    • Creates User entity via User.create()                     │
│    • Calls userRepository.save(user)                           │
│    • Returns UserResponseDTO                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (create domain entity)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. User.create(id, name, email)                [DOMAIN]        │
│    • Creates User entity with business invariants              │
│    • Returns immutable User object                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (save to repository)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. InMemoryUserRepository.save(user) [INTERFACE ADAPTERS]      │
│    • Implements IUserRepository port                           │
│    • Stores user in in-memory map                              │
│    • Could be swapped with: PrismaRepository,                  │
│      TypeORMRepository, FirebaseRepository, etc.               │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (return to use case)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Use Case returns UserResponseDTO         [APPLICATION]      │
│    Contains: id, name, email, createdAt                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (format for web)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. UserPresenter.present(userResponseDTO)  [INTERFACE ADAPTERS]│
│    • Converts DTO to JSON format                               │
│    • Formats dates as ISO strings                              │
│    • Returns plain object ready for JSON.stringify()           │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (send response)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. HTTP Response 201 Created                   [FRAMEWORKS]    │
│    {                                                            │
│      "id": "1",                                                 │
│      "name": "John",                                            │
│      "email": "john@example.com",                               │
│      "createdAt": "2024-02-26T10:30:00.000Z"                    │
│    }                                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Direction vs Flow of Control

```
DEPENDENCIES (always point inward):
────────────────────────────────────

    Domain Layer
          △
          │
          │ depends on
          │
    Application Layer
          △
          │
          │ depends on
          │
    Interface Adapters
          △
          │
          │ depends on
          │
    Frameworks & Drivers


CONTROL FLOW (can go in any direction):
───────────────────────────────────────

    Frameworks & Drivers
          │
          │ controls
          ▼
    Interface Adapters
          │
          │ controls
          ▼
    Application Layer
          │
          │ controls
          ▼
    Domain Layer


HOW THIS WORKS - Dependency Inversion:
──────────────────────────────────────

Use Case needs to calls Repository
(control flows down)

But Use Case depends on IUserRepository interface
Repository implements IUserRepository
(dependency points up)

Result: Control and dependencies are in opposite directions!
This is polymorphism in action.


Without Dependency Inversion:
┌─────────────────────────────┐
│   UseCase depends on        │
│   ConcreteRepository         │─── VIOLATES DEPENDENCY RULE
│   (knows implementation)     │
└─────────────────────────────┘

With Dependency Inversion:
┌─────────────────────────────┐
│   UseCase depends on        │
│   IUserRepository (interface)│─── FOLLOWS DEPENDENCY RULE
│        ▲                     │
│        │ implements          │
│   ConcreteRepository         │
└─────────────────────────────┘
```

## Layer Independence Example

### Changing the Database

**WITHOUT Clean Architecture:**

```
UserService uses MySQLUserRepository
      ↓
If we want PostgreSQL...
      ↓
Must change UserService code

Changes cascade through application
```

**WITH Clean Architecture:**

```
UseCase uses IUserRepository (interface)
      ↓
If we want PostgreSQL...
      ↓
Create PostgreSQLUserRepository implementing IUserRepository
      ↓
Inject it instead of MySQLUserRepository

UseCase code never changes!
Domain code never changes!
Application code never changes!
Only Framework layer changes (DI configuration)
```

## Testing Benefits

```
┌──────────────────────────────────────────┐
│ Test Domain (Entities)                   │
│ ✅ No mocks, no frameworks               │
│ ✅ Pure business logic                   │
│ Speed: ⚡⚡⚡ Very fast                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Test Application (Use Cases)              │
│ ✅ No Express, no real database          │
│ ✅ Inject in-memory repository            │
│ Speed: ⚡⚡ Fast                          │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Test Interface Adapters (Integration)    │
│ ✅ Test with mocked use cases            │
│ ⚠️ May need real database                │
│ Speed: ⚡ Slower (I/O)                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Test Frameworks (E2E)                    │
│ ✅ Full integration test                 │
│ ⚠️ Real database, real framework         │
│ Speed: 🐢 Very slow (full setup)        │
└──────────────────────────────────────────┘

All layers testable independently first!
```

## How Each Layer Contributes

```
┌───────────────────────────────────────────────────────────┐
│ FRAMEWORKS & DRIVERS                                      │
│ Responsibility: Integrate with external systems           │
│ What changes? Everything (tech stack)                     │
│ Can be replaced? YES (completely)                        │
│ Business value: How we interact with the world           │
└───────────────────────────────────────────────────────────┘
          ▲
          │ depends on
          │
┌───────────────────────────────────────────────────────────┐
│ INTERFACE ADAPTERS                                        │
│ Responsibility: Convert data formats                      │
│ What changes? Rarely (structure stays similar)           │
│ Can be replaced? YES (swap implementation)               │
│ Business value: Bridge to external systems              │
└───────────────────────────────────────────────────────────┘
          ▲
          │ depends on
          │
┌───────────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                         │
│ Responsibility: Orchestrate business logic               │
│ What changes? Sometimes (new use cases)                  │
│ Can be replaced? NO (this is your business)             │
│ Business value: Your application's features             │
└───────────────────────────────────────────────────────────┘
          ▲
          │ depends on
          │
┌───────────────────────────────────────────────────────────┐
│ DOMAIN LAYER                                              │
│ Responsibility: Express business rules                    │
│ What changes? Almost never (core rules are stable)       │
│ Can be replaced? NO (your business itself)               │
│ Business value: Your core knowledge & policies           │
└───────────────────────────────────────────────────────────┘
```

## Success Indicators

✅ **Domain layer has ZERO external dependencies**
✅ **Outer layers don't know about inner layers**
✅ **You can test without the web server**
✅ **You can test without the database**
✅ **You can swap Express for Fastify painlessly**
✅ **You can swap MongoDB for PostgreSQL painlessly**
✅ **New developers understand the architecture in 5 minutes**
✅ **Business logic is separated from framework details**
