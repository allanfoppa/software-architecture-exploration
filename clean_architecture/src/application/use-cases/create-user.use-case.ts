/**
 * APPLICATION LAYER - USE CASES
 *
 * Contains application-specific business rules.
 * It encapsulates and implements all use cases of the system.
 * Use cases orchestrate the flow of data to and from entities.
 */

import { User, IUserRepository } from "../../domain";
import { CreateUserRequestDTO, UserResponseDTO } from "../dtos/user.dto";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: CreateUserRequestDTO): Promise<UserResponseDTO> {
    // Create a domain entity
    const user = User.create(request.id, request.name, request.email);

    // Persist the user using the injected repository
    await this.userRepository.save(user);

    // Return response DTO
    return new UserResponseDTO(
      user.getId(),
      user.getName(),
      user.getEmail(),
      user.getCreatedAt(),
    );
  }
}
