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
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const Product_1 = require("../models/Product");
// Create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            throw new Error('Please provide a name, description and price');
        }
        const product = yield Product_1.Product.create({ name, description, price });
        return res.status(201).json({ ok: true, message: 'Created Product !', product });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to create product', message: error.message });
    }
});
exports.createProduct = createProduct;
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.findAll();
        return res.status(200).json({ ok: true, message: 'Fetched Products !', products });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to fetch products' });
    }
});
exports.getProducts = getProducts;
// Update a product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        if (!name || !description || !price) {
            throw new Error('Please provide a name, description and price');
        }
        const product = yield Product_1.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ ok: false, error: 'Product not found' });
        }
        product.name = name;
        product.description = description;
        product.price = price;
        yield product.save();
        return res.status(200).json({ ok: true, message: 'Updated Product !', product });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to update product', message: error.message });
    }
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield Product_1.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ ok: false, error: 'Product not found' });
        }
        yield product.destroy();
        return res.status(200).json({ ok: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: true, error: 'Failed to delete product' });
    }
});
exports.deleteProduct = deleteProduct;
