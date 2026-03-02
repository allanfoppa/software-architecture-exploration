/**
 * Tests - Use Cases
 */

import { CreateUserUseCase } from "../../../src/application/use-cases/create-user.use-case";
import { FindAllUsersUseCase } from "../../../src/application/use-cases/find-all-users.use-case";
import { CreateUserRequestDTO } from "../../../src/application/dtos/user.dto";
import { InMemoryUserRepository } from "../../../src/interface-adapters/repositories/in-memory-user.repository";

describe("User Use Cases", () => {
  let repository: InMemoryUserRepository;
  let createUserUseCase: CreateUserUseCase;
  let findAllUsersUseCase: FindAllUsersUseCase;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(repository);
    findAllUsersUseCase = new FindAllUsersUseCase(repository);
  });

  describe("CreateUserUseCase", () => {
    it("should create a user successfully", async () => {
      const request = new CreateUserRequestDTO(
        "1",
        "John Doe",
        "john@example.com",
      );
      const response = await createUserUseCase.execute(request);

      expect(response.id).toBe("1");
      expect(response.name).toBe("John Doe");
      expect(response.email).toBe("john@example.com");
    });
  });

  describe("FindAllUsersUseCase", () => {
    it("should return all created users", async () => {
      await createUserUseCase.execute(
        new CreateUserRequestDTO("1", "John", "john@example.com"),
      );
      await createUserUseCase.execute(
        new CreateUserRequestDTO("2", "Jane", "jane@example.com"),
      );

      const response = await findAllUsersUseCase.execute();

      expect(response).toHaveLength(2);
      expect(response[0].name).toBe("John");
      expect(response[1].name).toBe("Jane");
    });

    it("should return empty array when no users exist", async () => {
      const response = await findAllUsersUseCase.execute();

      expect(response).toHaveLength(0);
    });
  });
});
