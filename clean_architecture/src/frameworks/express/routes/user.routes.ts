import { Router } from "express";
import {
  CreateUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
} from "../../../application";
import {
  InMemoryUserRepository,
  UserPresenter,
  UserController,
} from "../../../interface-adapters";

const router: Router = Router();

const userRepository = new InMemoryUserRepository();
const userPresenter = new UserPresenter();
const userController = new UserController(
  new CreateUserUseCase(userRepository),
  new FindAllUsersUseCase(userRepository),
  new FindUserByIdUseCase(userRepository),
  userPresenter,
);

router.post("/", (req, res) => userController.create(req, res));
router.get("/", (req, res) => userController.findAll(req, res));
router.get("/:id", (req, res) => userController.findById(req, res));

export default router;
