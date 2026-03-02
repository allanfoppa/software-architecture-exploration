/**
 * INTERFACE ADAPTERS LAYER - PRESENTERS
 *
 * Converts data from use case output to a format suitable for the web/UI.
 * This follows the Dependency Inversion Principle where the use case
 * depends on an interface that the presenter implements.
 */

import { UserResponseDTO } from "../../application/dtos/user.dto";

export interface IUserPresenter {
  present(response: UserResponseDTO): Record<string, unknown>;
  presentAll(responses: UserResponseDTO[]): Record<string, unknown>[];
}

export class UserPresenter implements IUserPresenter {
  present(response: UserResponseDTO): Record<string, unknown> {
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      createdAt: response.createdAt.toISOString(),
    };
  }

  presentAll(responses: UserResponseDTO[]): Record<string, unknown>[] {
    return responses.map((response) => this.present(response));
  }
}
