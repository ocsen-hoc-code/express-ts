import { inject, injectable } from "inversify";
import { UserRepository } from "../repositories/user.repository";
import TYPES from "../types";
import { User } from "../models/user";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";

@injectable()
export class UserService {
  performTransaction() {
    throw new Error("Method not implemented.");
  }
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.createUser(
      name,
      email,
      hashedPassword
    );
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAllUsers();
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    // Find the user by email
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password); // Assuming password is hashed
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate a JWT token
    const token = generateToken({ id: user.id, email: user.email });
    return { token };
  }
}
