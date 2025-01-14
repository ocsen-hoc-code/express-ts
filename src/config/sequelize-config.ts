import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || 'ocsen_db',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'dev',
});

export default sequelize;
