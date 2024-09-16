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
exports.processPayment = void 0;
const Order_1 = require("../models/Order");
const Inventory_1 = require("../models/Inventory");
const OrderLog_1 = require("../models/OrderLog");
const db_1 = __importDefault(require("../db"));
// Function to process payment and handle inventory correctly
const processPayment = (orderId_1, ...args_1) => __awaiter(void 0, [orderId_1, ...args_1], void 0, function* (orderId, inventoryRestored = false, retry = false) {
    const transaction = yield db_1.default.transaction();
    try {
        if (!orderId) {
            throw new Error("Provide orderId !");
        }
        const order = yield Order_1.Order.findByPk(orderId, { transaction });
        if (!order) {
            throw new Error('Order not found!');
        }
        const inventory = yield Inventory_1.Inventory.findOne({ where: { productId: order.productId }, transaction });
        if (!inventory) {
            throw new Error("Product inventory not found!");
        }
        // If inventory was restored (due to a previous payment failure), we need to check stock again
        if (inventoryRestored && inventory.quantity < order.quantity) {
            throw new Error("Insufficient stock for retry!");
        }
        // Deduct stock if restored
        if (inventoryRestored) {
            inventory.quantity -= order.quantity;
            yield inventory.save({ transaction });
        }
        // Simulate random payment success or failure
        const isPaymentSuccessful = Math.random() > 0.5; // 50% success rate
        if (!isPaymentSuccessful) {
            throw new Error("Payment failed");
        }
        // Payment succeeded
        yield transaction.commit();
        // Log successful payment
        yield OrderLog_1.OrderLog.create({
            orderId,
            status: "processed",
            processedAt: new Date(),
        });
        yield order.update({
            status: 'processed'
        });
        console.log("Payment successful for order", orderId);
        return;
    }
    catch (error) {
        yield transaction.rollback();
        console.error(`Payment failed for order ${orderId}:`, error.message);
        // Add back the reserved inventory in case of failure
        if (error.message == 'Payment failed') {
            try {
                const order = yield Order_1.Order.findByPk(orderId);
                if (order) {
                    const inventory = yield Inventory_1.Inventory.findOne({ where: { productId: order.productId } });
                    if (inventory) {
                        inventory.quantity += order.quantity; // Restore reserved stock
                        yield inventory.save();
                        inventoryRestored = true;
                    }
                }
            }
            catch (restoreError) {
                console.error("Failed to restore inventory after payment failure:", restoreError);
            }
        }
        // Log failed payment and retry
        yield OrderLog_1.OrderLog.create({
            orderId,
            status: 'failed',
            errorMessage: error.message,
            processedAt: new Date(),
        });
        if (orderId) {
            yield Order_1.Order.update({
                status: 'failed'
            }, { where: { id: orderId } });
        }
        //  Retry logic 15s
        if ((error.message == 'Payment failed' || error.message == 'Insufficient stock for retry!') && !retry) {
            setTimeout(() => {
                (0, exports.processPayment)(orderId, inventoryRestored, true);
            }, 15 * 1000);
        }
    }
});
exports.processPayment = processPayment;
// Gracefully handle server crashes by registering exit handlers
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down gracefully...');
    process.exit(0);
}));
