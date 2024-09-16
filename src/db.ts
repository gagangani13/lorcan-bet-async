import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize(
  process.env.DB_NAME as string,   // Database name
  process.env.DB_USER as string ||'postgres',   // Database username
  process.env.DB_PASS as string,   // Database password
  {
    host: process.env.DB_HOST || 'localhost',     // Database host
    port: Number(process.env.DB_PORT) || 5432,  // Database port
    dialect: 'postgres',           // Dialect to use
  }
);

export default sequelize;
