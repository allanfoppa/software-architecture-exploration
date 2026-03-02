/**
 * APPLICATION LAYER - USE CASES
 */

import { IUserRepository } from "../../domain";
import { UserResponseDTO } from "../dtos/user.dto";

export class FindUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return new UserResponseDTO(
      user.getId(),
      user.getName(),
      user.getEmail(),
      user.getCreatedAt(),
    );
  }
}
