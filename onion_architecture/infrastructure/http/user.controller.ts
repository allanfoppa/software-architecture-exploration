import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserUseCase } from "core/application/use-cases/register-user.use-case";
import { CreateUserRequestDto } from "./dto/create-user.request.dto";
import { CreateUserResponseDto } from "./dto/create-user.response.dto";

@Controller("users")
export class UserController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post()
  async create(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    // Use case handles ID generation
    const user = await this.registerUser.execute({
      name: dto.name,
      email: dto.email,
    });

    // Map domain entity to response DTO
    return new CreateUserResponseDto(user.id, user.name, user.email);
  }
}
