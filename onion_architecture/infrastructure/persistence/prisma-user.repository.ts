import { Injectable } from "@nestjs/common";
import { UserRepository } from "core/domain/ports/user.repository.port";
import { User } from "core/domain/entities/user.entity";

/**
 * Prisma User Repository Implementation
 *
 * This is a placeholder implementation. In a production environment,
 * you would use Prisma client to interact with the database.
 *
 * Example with Prisma:
 * - constructor(private prisma: PrismaService) {}
 * - this.prisma.user.create({ data: user })
 * - this.prisma.user.findUnique({ where: { id } })
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  // Placeholder in-memory store for demonstration
  private users: Map<string, User> = new Map();

  /**
   * Save a user to the database
   * @param user - The user entity to persist
   */
  async save(user: User): Promise<void> {
    // TODO: Implement Prisma save logic
    // const savedUser = await this.prisma.user.create({
    //   data: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //   },
    // });

    // For now, store in memory for demonstration
    this.users.set(user.id, user);
    console.log(`User persisted: ${user.name} (${user.email})`);
  }

  /**
   * Retrieve a user by ID
   * @param id - The user ID to search for
   * @returns The user entity or null if not found
   */
  async getById(id: string): Promise<User | null> {
    // TODO: Implement Prisma query logic
    // const user = await this.prisma.user.findUnique({
    //   where: { id },
    // });
    // return user || null;

    // For now, retrieve from in-memory store
    return this.users.get(id) || null;
  }
}
