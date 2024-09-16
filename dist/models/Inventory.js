"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const Product_1 = require("./Product");
// Define the Inventory model
class Inventory extends sequelize_1.Model {
}
exports.Inventory = Inventory;
// Initialize the Inventory model
Inventory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
            model: Product_1.Product, // Reference to Product model
            key: 'id',
        },
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: db_1.default,
    tableName: 'Inventory',
    timestamps: true,
});
// Set up associations (if needed)
Product_1.Product.hasMany(Inventory, { foreignKey: 'ProductId' });
Inventory.belongsTo(Product_1.Product, { foreignKey: 'ProductId' });
