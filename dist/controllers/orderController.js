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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.getOrders = exports.processOrder = exports.createOrder = void 0;
const Order_1 = require("../models/Order");
const Inventory_1 = require("../models/Inventory");
const paymentService_1 = require("../utils/paymentService"); // Hypothetical payment service function
const db_1 = __importDefault(require("../db"));
// Create and process an order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            throw new Error('Please provide a productId and quantity');
        }
        // Check if product exists in inventory
        const inventory = yield Inventory_1.Inventory.findOne({ where: { productId }, transaction });
        if (!inventory) {
            throw new Error('Product not found in inventory');
        }
        if (inventory.quantity < quantity) {
            throw new Error('Insufficient stock in inventory');
        }
        // Create the order first
        const order = yield Order_1.Order.create({ productId, quantity, status: 'pending' }, { transaction });
        // Deduct inventory for reserving
        inventory.quantity -= quantity;
        yield inventory.save({ transaction });
        yield transaction.commit(); // Commit the transaction
        // Process the order asynchronously
        (0, exports.processOrder)(order.id).catch(error => {
            console.error('Error processing order:', error.message);
        });
        return res.status(201).json({ ok: true, message: 'Order created and processing started', order });
    }
    catch (error) {
        yield transaction.rollback(); // Rollback if anything goes wrong
        return res.status(500).json({ ok: false, error: 'Failed to create order', message: error.message });
    }
});
exports.createOrder = createOrder;
// Process the order (inventory reservation + payment)
const processOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        // Retrieve the order
        const order = yield Order_1.Order.findByPk(orderId, { transaction });
        if (!order) {
            throw new Error('Order not found');
        }
        // Payment processing (simulated)
        yield (0, paymentService_1.processPayment)(orderId); // Assume this is an async function
        // Update order status to processed if payment succeeds
        order.status = 'processed';
        yield order.save({ transaction });
        yield transaction.commit();
        console.log('Payment successful for order', orderId);
    }
    catch (error) {
        yield transaction.rollback();
        // Log the failure in OrderLogs (you'd implement this as needed)
        console.error('Order processing failed:', error.message);
        // Optionally, handle retries or other compensating actions here
    }
});
exports.processOrder = processOrder;
// Get all orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.findAll();
        return res.status(200).json({ ok: true, message: 'Fetched Orders!', orders });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to fetch orders' });
    }
});
exports.getOrders = getOrders;
// Get  order
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const order = yield Order_1.Order.findOne({ where: { id } });
        if (!order) {
            throw new Error("Invalid Order Id");
        }
        return res.status(200).json({ ok: true, message: 'Fetched Order!', order });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: 'Failed to fetch orders' });
    }
});
exports.getOrder = getOrder;
