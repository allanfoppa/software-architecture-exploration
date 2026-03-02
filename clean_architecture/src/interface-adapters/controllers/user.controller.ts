/**
 * INTERFACE ADAPTERS LAYER - CONTROLLERS
 *
 * Handles HTTP requests and delegates to use cases.
 * Controllers are adapters that convert HTTP data into a format
 * that use cases understand.
 *
 * NOTE: IN A REAL APPLICATION, IS MORE LIKELY HAVE MORE CONTROLLERS AND THEY WOULD BE IN SEPARATE FILES.
 * WARNING: THIS IS JUST A SIMPLIFIED EXAMPLE.
 */

import { Request, Response } from "express";
import {
  CreateUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
  CreateUserRequestDTO,
} from "../../application";
import { UserPresenter } from "../presenters/user.presenter";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private findAllUsersUseCase: FindAllUsersUseCase,
    private findUserByIdUseCase: FindUserByIdUseCase,
    private userPresenter: UserPresenter,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, email } = req.body;
      const request = new CreateUserRequestDTO(id, name, email);
      const response = await this.createUserUseCase.execute(request);
      res.status(201).json(this.userPresenter.present(response));
    } catch (error) {
      res.status(400).json({ error: "Failed to create user" });
    }
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const response = await this.findAllUsersUseCase.execute();
      res.status(200).json(this.userPresenter.presentAll(response));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await this.findUserByIdUseCase.execute(id);

      if (!response) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(this.userPresenter.present(response));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
}
