import { User, UserRepository } from "@onion/core-domain";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return Promise.resolve(user ?? null);
  }
}
