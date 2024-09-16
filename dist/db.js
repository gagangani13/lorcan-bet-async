"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, // Database name
process.env.DB_USER || 'postgres', // Database username
process.env.DB_PASS, // Database password
{
    host: process.env.DB_HOST || 'localhost', // Database host
    port: Number(process.env.DB_PORT) || 5432, // Database port
    dialect: 'postgres', // Dialect to use
});
exports.default = sequelize;
