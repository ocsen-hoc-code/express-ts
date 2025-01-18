import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "ocsen_db",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    port: parseInt(process.env.DB_PORT || "5432"),
    synchronize: process.env.NODE_ENV == "dev",
    logging: false,
    entities: [__dirname + '/../models/*.ts'],
    migrations: [__dirname + '/../migrations/*.ts'],
});
