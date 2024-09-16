import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import { Product } from './Product';

// Interface for Inventory attributes
export interface InventoryAttributes {
  id: number;
  productId: number;
  quantity: number;
}

// Optional fields for creating inventory
export interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id'> {}

// Define the Inventory model
export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  public id!: number;
  public productId!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Inventory model
Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique:true,
      references: {
        model: Product, // Reference to Product model
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'Inventory',
    timestamps: true,
  }
);

// Set up associations (if needed)
Product.hasMany(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });
