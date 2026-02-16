# 📖 RESPONSIBILITY GUIDE: Onion Architecture

This document serves as a reference for distributing logic, validations, and business rules within the project.

---

## 1. Domain Rules (The Entity)

**Where:** `core/domain/src/entities/user.entity.ts`
**What goes here:** Validations that define what a **"User" is**, regardless of the context. If the rule concerns the **state** of the object, it belongs here.

### Examples:

- Validating email format.
- Checking if the name has more than 3 characters.
- **Tier Rules:** "Only users with a corporate email can be an `admin`."
- **Date Functions:** If a user must be over 18, the `isAdult()` logic resides inside the Entity.

```typescript
export class User {
  private constructor(private props: UserProps) {}

  static create(props: UserProps) {
    // Rule: Domain Integrity
    if (props.role === "admin" && !props.email.endsWith("@company.com")) {
      throw new Error("Only corporate emails can be administrators");
    }
    return new User(props);
  }
}
```

## 2. Application Rules (The Use Case)

**Where:** `core/application/src/use-cases/...`
**What goes here**: Rules that depend on other services or the process flow. This defines "who can do what" in the system.

### Examples:

- Uniqueness: "Cannot create two users with the same email" (requires repository consultation).
- Side Effects: "When deleting a user, trigger a farewell email."
- Flow Permissions: "Only a logged-in admin can create other admin users."

```typeScript
// Example inside a Use Case
async execute(requester: User, input: CreateUserInput) {
  if (input.role === 'admin' && requester.role !== 'admin') {
    throw new Error('Access Denied: Only admins can create other admins');
  }
  // ... proceed with logic
}
```

## 3. Infrastructure Logic and Utilities

**Where:** `core/domain/src/utils` or `infrastructure/shared`
**What goes here:** Pure tools (such as date manipulation or encryption).

### Date Functions:

- **Generic Functions:** If it is a generic helper (e.g., `formatDateToISO`), place it in a `utils` folder inside the **Core** (if the core needs it).
- **External Libraries:** If using an external library (e.g., `date-fns`), you can create a **Port** (Interface) in the Core and implement it in the **Infra** layer, ensuring your Domain does not depend on the library.

---

## 📊 Comparative Summary

| Rule Type                                    | Layer                        | Why?                                                                |
| :------------------------------------------- | :--------------------------- | :------------------------------------------------------------------ |
| **Object Integrity** (email, age)            | Domain (Entity)              | The object must not exist in an invalid state.                      |
| **Coordination/Process** (duplicity, emails) | Application (Use Case)       | Involves database lookups or other external services.               |
| **Data Transformation** (DB formatting)      | Infrastructure (Persistence) | It is a technical detail of how data is stored.                     |
| **Access Permission** (Admin vs User)        | Application + Infrastructure | Infra identifies the user; Application decides if they can proceed. |
