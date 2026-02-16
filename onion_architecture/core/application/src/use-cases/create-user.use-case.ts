import { User, UserRepository } from "@onion/core-domain/";

export interface CreateUserInput {
  name: string;
  email: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<void> {
    // Check if the user already exists in the repository
    const existingUser = await this.userRepo.findByEmail(dto.email);

    if (existingUser) {
      // If the email is already taken, we prevent creation
      throw new Error("User with this email already exists");
    }

    const user = new User(input);
    await this.userRepository.save(user);
  }
}
