"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderLog = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const Order_1 = require("./Order");
// Define the OrderLog model
class OrderLog extends sequelize_1.Model {
}
exports.OrderLog = OrderLog;
// Initialize the OrderLog model
OrderLog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Order_1.Order,
            key: 'id',
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'processed', 'failed'),
        allowNull: false,
    },
    processedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    errorMessage: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    tableName: 'Order_Logs',
    timestamps: true,
});
Order_1.Order.hasMany(OrderLog, { foreignKey: 'OrderId' });
OrderLog.belongsTo(Order_1.Order, { foreignKey: 'OrderId' });
