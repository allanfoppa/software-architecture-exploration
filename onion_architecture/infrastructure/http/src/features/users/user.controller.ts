import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import {
  CreateUserUseCase,
  FindAllUsersUseCase,
} from '@onion/core-application';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { TOKENS } from '../../constants/tokens';
import { User } from '@onion/core-domain';

@Controller('users')
export class UserController {
  constructor(
    @Inject(TOKENS.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(TOKENS.FindAllUsersUseCase)
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    if (!this.createUserUseCase) {
      throw new Error('UseCase is still undefined at runtime!');
    }
    return await this.createUserUseCase.execute(dto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    if (!this.findAllUsersUseCase) {
      throw new Error('UseCase is still undefined at runtime!');
    }
    return await this.findAllUsersUseCase.execute();
  }
}
