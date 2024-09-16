"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const Product_1 = require("./Product");
// Define the Order model
class Order extends sequelize_1.Model {
}
exports.Order = Order;
// Initialize the Order model
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Product_1.Product,
            key: 'id',
        },
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'processed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    sequelize: db_1.default,
    tableName: 'Orders',
    timestamps: true,
});
Product_1.Product.hasMany(Order, { foreignKey: 'ProductId' });
Order.belongsTo(Product_1.Product, { foreignKey: 'ProductId' });
