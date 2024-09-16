"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        // Create Categories table
        yield queryInterface.createTable('Categories', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        });
        // Create Product_Categories table
        yield queryInterface.createTable('Product_Categories', {
            product_id: {
                type: sequelize_1.DataTypes.INTEGER,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                allowNull: false,
            },
            category_id: {
                type: sequelize_1.DataTypes.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                allowNull: false,
            },
        });
        // Add composite primary key
        yield queryInterface.addConstraint('Product_Categories', {
            fields: ['product_id', 'category_id'],
            type: 'primary key',
            name: 'product_category_primary_key',
        });
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove the composite primary key constraint
        yield queryInterface.removeConstraint('Product_Categories', 'product_category_primary_key');
        // Drop Product_Categories table first
        yield queryInterface.dropTable('Product_Categories');
        // Drop Categories table
        yield queryInterface.dropTable('Categories');
    }),
};
