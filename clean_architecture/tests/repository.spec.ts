/**
 * Tests - Repository
 */

import { User } from "../../../src/domain";
import { InMemoryUserRepository } from "../../../src/interface-adapters/repositories/in-memory-user.repository";

describe("InMemoryUserRepository", () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it("should save and retrieve a user", async () => {
    const user = User.create("1", "John Doe", "john@example.com");
    await repository.save(user);

    const result = await repository.findById("1");

    expect(result).not.toBeNull();
    expect(result?.getName()).toBe("John Doe");
    expect(result?.getEmail()).toBe("john@example.com");
  });

  it("should return null for non-existent user", async () => {
    const result = await repository.findById("non-existent");

    expect(result).toBeNull();
  });

  it("should find all users", async () => {
    await repository.save(User.create("1", "John", "john@example.com"));
    await repository.save(User.create("2", "Jane", "jane@example.com"));

    const users = await repository.findAll();

    expect(users).toHaveLength(2);
  });

  it("should delete a user", async () => {
    const user = User.create("1", "John Doe", "john@example.com");
    await repository.save(user);

    await repository.delete("1");

    const result = await repository.findById("1");
    expect(result).toBeNull();
  });
});
