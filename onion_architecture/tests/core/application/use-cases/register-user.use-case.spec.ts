import { RegisterUserUseCase } from "./register-user.use-case";
import { UserRepository } from "../../domain/ports/user.repository.port";
import { User } from "../../domain/entities/user.entity";

describe("RegisterUserUseCase", () => {
  let useCase: RegisterUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      getById: jest.fn(),
    };
    useCase = new RegisterUserUseCase(mockRepository);
  });

  it("should save a valid user", async () => {
    const input = {
      name: "Allan",
      email: "allan@test.com",
    };

    const result = await useCase.execute(input);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.id).toBeDefined();
  });

  it("should generate a unique ID for new user", async () => {
    const input = {
      name: "John",
      email: "john@test.com",
    };

    const result1 = await useCase.execute(input);
    const result2 = await useCase.execute(input);

    expect(result1.id).not.toBe(result2.id);
  });

  it("should pass the user entity to repository save method", async () => {
    const input = {
      name: "Jane",
      email: "jane@test.com",
    };

    await useCase.execute(input);

    const savedUser = mockRepository.save.mock.calls[0][0];
    expect(savedUser.name).toBe(input.name);
    expect(savedUser.email).toBe(input.email);
    expect(savedUser.id).toBeDefined();
  });

  it("should return user entity after saving", async () => {
    const input = {
      name: "Bob",
      email: "bob@test.com",
    };

    const result = await useCase.execute(input);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name", input.name);
    expect(result).toHaveProperty("email", input.email);
  });

  it("should handle repository errors", async () => {
    const input = {
      name: "Alice",
      email: "alice@test.com",
    };

    mockRepository.save.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(input)).rejects.toThrow("Database error");
  });
});
