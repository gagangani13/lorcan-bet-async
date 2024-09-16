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
exports.deleteInventory = exports.updateInventory = exports.getInventory = exports.createInventory = void 0;
const Inventory_1 = require("../models/Inventory");
const Product_1 = require("../models/Product");
// Create inventory for a product
const createInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            throw new Error('Please provide a productId and quantity');
        }
        const product = yield Product_1.Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ ok: false, error: 'Product not found' });
        }
        const inventory = yield Inventory_1.Inventory.create({ productId, quantity });
        return res.status(201).json({ ok: true, message: 'Created Inventory!', inventory });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to create inventory', message: error.message });
    }
});
exports.createInventory = createInventory;
// Get all inventory
const getInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory = yield Inventory_1.Inventory.findAll();
        return res.status(200).json({ ok: true, message: 'Fetched Inventory!', inventory });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to fetch inventory' });
    }
});
exports.getInventory = getInventory;
// Update inventory for a product
const updateInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            throw new Error('Please provide a productId and quantity');
        }
        const inventory = yield Inventory_1.Inventory.findByPk(id);
        if (!inventory) {
            return res.status(404).json({ ok: false, error: 'Inventory not found' });
        }
        inventory.productId = productId;
        inventory.quantity = quantity;
        yield inventory.save();
        return res.status(200).json({ ok: true, message: 'Updated Inventory!', inventory });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to update inventory', message: error.message });
    }
});
exports.updateInventory = updateInventory;
// Delete inventory for a product
const deleteInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const inventory = yield Inventory_1.Inventory.findByPk(id);
        if (!inventory) {
            return res.status(404).json({ ok: false, error: 'Inventory not found' });
        }
        yield inventory.destroy();
        return res.status(200).json({ ok: true, message: 'Inventory deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to delete inventory' });
    }
});
exports.deleteInventory = deleteInventory;
