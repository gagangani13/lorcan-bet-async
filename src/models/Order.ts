import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { Product } from './Product';

// Interface for Order attributes
export interface OrderAttributes {
  id: number;
  productId: number;
  quantity: number;
  status: 'pending' | 'processed' | 'failed';
}

// Optional fields for creating an order
export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status'> {}

// Define the Order model
export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public status!: 'pending' | 'processed' | 'failed';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Order model
Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'Orders',
    timestamps: true,
  }
);

Product.hasMany(Order, { foreignKey: 'productId' });
Order.belongsTo(Product, { foreignKey: 'productId' });
