import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // Create Categories table
    await queryInterface.createTable('Categories', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // Create Product_Categories table
    await queryInterface.createTable('Product_Categories', {
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
    });

    // Add composite primary key
    await queryInterface.addConstraint('Product_Categories', {
      fields: ['product_id', 'category_id'],
      type: 'primary key',
      name: 'product_category_primary_key',
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Remove the composite primary key constraint
    await queryInterface.removeConstraint('Product_Categories', 'product_category_primary_key');

    // Drop Product_Categories table first
    await queryInterface.dropTable('Product_Categories');

    // Drop Categories table
    await queryInterface.dropTable('Categories');
  },
};
