import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/user";

@injectable()
export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async createUser(name: string, email: string, password: string): Promise<User> {
        const user = this.repository.create({ name, email, password });
        return await this.repository.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.repository.find();
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email } });
    }
}
