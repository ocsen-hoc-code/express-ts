import { UserService } from "../services/user.services"; // Relative path as provided
import { UserRepository } from "../repositories/user.repository"; // Relative path as provided
import { User } from "../models/user"; // Relative path as provided
import { generateToken } from "../utils/jwt"; // Relative path as provided

// Mock the UserRepository and generateToken
jest.mock("../repositories/user.repository");
jest.mock("../utils/jwt");

describe("UserService", () => {
    let userRepositoryMock: jest.Mocked<UserRepository>;
    let userService: UserService;

    beforeEach(() => {
        // Create a mocked instance of UserRepository
        userRepositoryMock = {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findUserByEmail: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        // Initialize UserService with the mocked UserRepository
        userService = new UserService(userRepositoryMock);
    });

    describe("createUser", () => {
        it("should create a new user", async () => {
            const mockUser: User = { id: 1, name: "John Doe", password: "hashedpassword", email: "john@example.com", isActive: true };
            userRepositoryMock.createUser.mockResolvedValue(mockUser);

            const result = await userService.createUser("John Doe", "john@example.com", "password123");

            expect(userRepositoryMock.createUser).toHaveBeenCalledWith("John Doe", "john@example.com", expect.any(String));
            expect(result).toEqual(mockUser);
        });
    });

    describe("login", () => {
        it("should generate a token for valid credentials", async () => {
            const mockUser: User = { id: 1, name: "John Doe", email: "john@example.com", isActive: true, password: "hashedpassword" };
            userRepositoryMock.findUserByEmail.mockResolvedValue(mockUser);

            const bcrypt = require("bcrypt");
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            const mockToken = "mocked.jwt.token";
            (generateToken as jest.Mock).mockReturnValue(mockToken);

            const result = await userService.login("john@example.com", "password123");

            expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith("john@example.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedpassword");
            expect(generateToken).toHaveBeenCalledWith({ id: mockUser.id, email: mockUser.email });
            expect(result).toEqual({ token: mockToken });
        });

        it("should throw an error for invalid email", async () => {
            userRepositoryMock.findUserByEmail.mockResolvedValue(null);

            await expect(userService.login("invalid@example.com", "password123")).rejects.toThrow("Invalid email or password");
            expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith("invalid@example.com");
        });

        it("should throw an error for invalid password", async () => {
            const mockUser: User = { id: 1, name: "John Doe", email: "john@example.com", isActive: true, password: "hashedpassword" };
            userRepositoryMock.findUserByEmail.mockResolvedValue(mockUser);

            const bcrypt = require("bcrypt");
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(userService.login("john@example.com", "wrongpassword")).rejects.toThrow("Invalid email or password");
            expect(userRepositoryMock.findUserByEmail).toHaveBeenCalledWith("john@example.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpassword");
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const mockUsers: User[] = [
                { id: 1, name: "John Doe", password: "password", email: "john@example.com", isActive: true },
                { id: 2, name: "Jane Doe", password: "password", email: "jane@example.com", isActive: true },
            ];
            userRepositoryMock.findAllUsers.mockResolvedValue(mockUsers);

            const result = await userService.getAllUsers();

            expect(userRepositoryMock.findAllUsers).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });
});



// import { UserService } from "../services/user.services";
// import { getManager, EntityManager } from "typeorm";
// import { User } from "../models/user";

// jest.mock("typeorm", () => ({
//     getManager: jest.fn(),
// }));

// describe("UserService", () => {
//     let mockManager: jest.Mocked<EntityManager>;
//     let userService: UserService;

//     beforeEach(() => {
//         mockManager = {
//             find: jest.fn(),
//             save: jest.fn(),
//             update: jest.fn(),
//             transaction: jest.fn(),
//         } as unknown as jest.Mocked<EntityManager>;

//         // Mock getManager to return the mocked EntityManager
//         (getManager as jest.Mock).mockReturnValue(mockManager);

//         // Initialize the UserService
//         userService = new UserService();
//     });

//     describe("getAllUsers", () => {
//         it("should fetch all users using EntityManager", async () => {
//             // Arrange: Mock the find method
//             const mockUsers: User[] = [
//                 { id: 1, name: "John Doe", password: "password", email: "john@example.com", isActive: true },
//                 { id: 2, name: "Jane Doe", password: "password", email: "jane@example.com", isActive: true },
//             ];
//             mockManager.find.mockResolvedValue(mockUsers);

//             // Act: Call the method
//             const result = await userService.getAllUsers();

//             // Assert: Ensure the method was called and returned correct data
//             expect(mockManager.find).toHaveBeenCalledWith(User);
//             expect(result).toEqual(mockUsers);
//         });
//     });

//     describe("performTransaction", () => {
//         it("should execute a transaction to save and update a user", async () => {
//             // Arrange: Mock the save and update methods
//             const mockUser: User = {
//               id: 1, name: "John Doe", email: "john@example.com", isActive: true,
//               password: ""
//             };
//             mockManager.save.mockResolvedValue(mockUser);

//             // Mock transaction to call the provided callback with the mock manager
//             mockManager.transaction.mockImplementation(async (callback) => {
//                 await callback(mockManager); // Simulate transactional callback
//             });

//             // Act: Call the method
//             await userService.performTransaction();

//             // Assert: Ensure save and update were called within the transaction
//             expect(mockManager.transaction).toHaveBeenCalled();
//             expect(mockManager.save).toHaveBeenCalledWith(User, {
//                 name: "John Doe",
//                 email: "john@example.com",
//                 isActive: true,
//             });
//             expect(mockManager.update).toHaveBeenCalledWith(User, { id: 1 }, { isActive: false });
//         });
//     });
// });
