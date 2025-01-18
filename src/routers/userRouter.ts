import { Router, Request, Response } from "express";
import container from "../config/inversify.config";
import TYPES from "../types";
import { UserService } from "../services/user.services";
import { validationResult } from "express-validator";
import { validateUserCreate } from "../validators/publishValidator";

const router = Router();
const userService = container.get<UserService>(TYPES.UserService);

router.post(
  "/user",
  validateUserCreate,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    // Validate the message body
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    res.status(201).json(user);
  }
);

router.get("/users", async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
});

router.get("/login", async (req, res) => {
  const errors = validationResult(req);

  // Validate the message body
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password } = req.body;
  const { token } = await userService.login(email, password);
  res.status(200).json(token);
});

export default router;
