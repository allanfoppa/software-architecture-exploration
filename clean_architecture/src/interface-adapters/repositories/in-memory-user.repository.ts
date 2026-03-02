/**
 * INTERFACE ADAPTERS LAYER - REPOSITORIES
 *
 * Implements the repository interfaces defined in the domain layer.
 * This is where we translate between domain entities and external systems.
 * Database details are hidden here.
 *
 * NOTE: IN A REAL APPLICATION, IS MORE LIKELY HAVE MORE REPOSITORIES FILES AND THEY WOULD BE IN SEPARATED.
 * WARNING: THIS IS JUST A SIMPLIFIED EXAMPLE.
 */

import { User, IUserRepository } from "../../domain";

export class InMemoryUserRepository implements IUserRepository {
  private users = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
