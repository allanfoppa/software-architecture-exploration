import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaUserRepository } from "../persistence/prisma-user.repository";
import { RegisterUserUseCase } from "core/application/use-cases/register-user.use-case";

@Module({
  controllers: [UserController],
  providers: [
    PrismaUserRepository,
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: PrismaUserRepository) => new RegisterUserUseCase(repo),
      inject: [PrismaUserRepository],
    },
  ],
})
export class UserModule {}
