/* eslint-disable */
import { User } from "@onion/core-domain/";
import { UserRepository } from "@onion/core-domain/";

export class PrismaUserRepository implements UserRepository {
  // Imaginando que o Prisma esteja injetado aqui
  async save(user: User): Promise<void> {
    console.log(`Save in real database: ${user.email}`);
    // await prisma.user.create({ data: { ... } });
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`Find by email in real database: ${email}`);
    // await prisma.user.create({ data: { ... } });
    return null; // Simulando que o usuário não existe
  }
}
