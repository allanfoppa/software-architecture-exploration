import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import {
  InMemoryUserRepository,
  // PrismaUserRepository,
} from '@onion/infrastructure-persistence';
import {
  CreateUserUseCase,
  FindAllUsersUseCase,
} from '@onion/core-application';
import { UserRepository } from '@onion/core-domain'; // Importe a interface/classe abstrata
import { TOKENS } from '../../constants/tokens';

// const prismaRepo: UserRepository = new PrismaUserRepository(); // in case we want to switch to Prisma later
const inMemoryRepo: UserRepository = new InMemoryUserRepository();

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: TOKENS.CreateUserUseCase,
      useFactory: () => new CreateUserUseCase(inMemoryRepo),
    },
    {
      provide: TOKENS.FindAllUsersUseCase,
      useFactory: () => new FindAllUsersUseCase(inMemoryRepo),
    },
  ],
})
export class UserModule {}
