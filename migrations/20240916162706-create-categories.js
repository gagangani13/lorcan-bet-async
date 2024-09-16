'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Categories table
    await queryInterface.createTable('Categories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create Product_Categories join table
    await queryInterface.createTable('Product_Categories', {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Categories', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Composite primary key for the Product_Categories table
    await queryInterface.addConstraint('Product_Categories', {
      fields: ['product_id', 'category_id'],
      type: 'primary key',
      name: 'product_category_pk',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop Product_Categories table first
    await queryInterface.dropTable('Product_Categories');

    // Drop Categories table
    await queryInterface.dropTable('Categories');
  },
};
