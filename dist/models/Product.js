"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
// Define the Product model
class Product extends sequelize_1.Model {
}
exports.Product = Product;
// Initialize the Product model
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: db_1.default, // Passing the sequelize instance
    tableName: 'Products', // Define table name
    timestamps: true, // Automatically handle createdAt/updatedAt
});
