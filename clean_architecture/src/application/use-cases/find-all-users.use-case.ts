/**
 * APPLICATION LAYER - USE CASES
 */

import { IUserRepository, User } from "../../domain";
import { UserResponseDTO } from "../dtos/user.dto";

export class FindAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map(
      (user) =>
        new UserResponseDTO(
          user.getId(),
          user.getName(),
          user.getEmail(),
          user.getCreatedAt(),
        ),
    );
  }
}
