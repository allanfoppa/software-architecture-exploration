import { UserRepository } from "../../domain/ports/user.repository.port";
import { User } from "../../domain/entities/user.entity";
import { RegisterUserInput } from "./register-user.input";

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    // Generate ID and create user entity
    const user: User = {
      id: this.generateId(),
      name: input.name,
      email: input.email,
    };

    // Persist user
    await this.userRepository.save(user);

    return user;
  }

  private generateId(): string {
    // Using crypto.randomUUID() for ID generation
    if (typeof globalThis !== "undefined" && globalThis.crypto) {
      return globalThis.crypto.randomUUID();
    }
    // Fallback for environments without crypto
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
