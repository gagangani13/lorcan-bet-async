import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// Interface for Product attributes
export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
}

// Optional fields for creating a product
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

// Define the Product model
export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;

  // Timestamps (optional, can add createdAt/updatedAt if necessary)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Product model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize, // Passing the sequelize instance
    tableName: 'Products', // Define table name
    timestamps: true, // Automatically handle createdAt/updatedAt
  }
);
