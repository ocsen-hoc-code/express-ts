import { UserRepository } from "../repositories/user.repository";
import { Repository } from "typeorm";
import { User } from "../models/user";

// Mock the Repository directly
const mockRepository: jest.Mocked<Repository<User>> = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
} as unknown as jest.Mocked<Repository<User>>;

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    // Create an instance of UserRepository with the mocked repository
    userRepository = new UserRepository();
    (userRepository as any).repository = mockRepository;
  });

  it("should create a new user", async () => {
    // Arrange: Mock data and repository behavior
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      password: "password",
      email: "john@example.com",
      isActive: true,
    };
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    // Act: Call the createUser method
    const result = await userRepository.createUser(
      "John Doe",
      "john@example.com",
      "password"
    );

    // Assert: Check that the repository methods were called correctly
    expect(mockRepository.create).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    });
    expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should return all users", async () => {
    // Arrange: Mock data and repository behavior
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        password: "password",
        email: "john@example.com",
        isActive: true,
      },
      {
        id: 2,
        name: "Jane Doe",
        password: "password",
        email: "jane@example.com",
        isActive: true,
      },
    ];
    mockRepository.find.mockResolvedValue(mockUsers);

    // Act: Call the findAllUsers method
    const result = await userRepository.findAllUsers();

    // Assert: Check that the repository methods were called correctly
    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });
});
