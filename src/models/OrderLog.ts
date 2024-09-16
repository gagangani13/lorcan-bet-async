import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { Order } from './Order';

// Interface for Order Log attributes
export interface OrderLogAttributes {
  id: number;
  orderId: number;
  status: 'pending' | 'processed' | 'failed';
  processedAt: Date;
  errorMessage?: string; // Nullable
}

// Optional fields for creating order logs
export interface OrderLogCreationAttributes extends Optional<OrderLogAttributes, 'id' | 'errorMessage'> {}

// Define the OrderLog model
export class OrderLog extends Model<OrderLogAttributes, OrderLogCreationAttributes> implements OrderLogAttributes {
  public id!: number;
  public orderId!: number;
  public status!: 'pending' | 'processed' | 'failed';
  public processedAt!: Date;
  public errorMessage?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the OrderLog model
OrderLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Order,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'processed', 'failed'),
      allowNull: false,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Order_Logs',
    timestamps: true,
  }
);

Order.hasMany(OrderLog, { foreignKey: 'orderId' });
OrderLog.belongsTo(Order, { foreignKey: 'orderId' });
