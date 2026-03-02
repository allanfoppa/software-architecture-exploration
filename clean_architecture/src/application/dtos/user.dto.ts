/**
 * APPLICATION LAYER - DTOs
 *
 * Data Transfer Objects for input/output.
 * These are used to transfer data across boundaries in a format
 * most convenient for the inner circles (use cases).
 */

export class CreateUserRequestDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
  ) {}
}

export class UserResponseDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly createdAt: Date,
  ) {}
}
