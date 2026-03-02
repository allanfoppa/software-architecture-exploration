/**
 * DOMAIN LAYER - PORTS (Interfaces/Contracts)
 *
 * Defines contracts that must be fulfilled by outer layers.
 * The domain does NOT know about implementations in the outer layers.
 * This ensures the Dependency Rule: inner circles don't depend on outer circles.
 */

import { User } from "../entities/user.entity";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void>;
}
