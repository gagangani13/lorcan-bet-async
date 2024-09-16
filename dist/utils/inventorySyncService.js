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
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = __importDefault(require("../db"));
const Inventory_1 = require("../models/Inventory");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// External warehouse API endpoint
const WAREHOUSE_API_URL = process.env.WAREHOUSE_API_URL || '';
// Function to fetch stock levels from the external warehouse API
function fetchExternalStockLevels() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(WAREHOUSE_API_URL);
            return response.data; // Assuming the API returns stock data in the response body
        }
        catch (error) {
            console.error('Error fetching stock levels from external warehouse:', error.message);
            throw error;
        }
    });
}
// Function to sync inventory levels
function syncInventoryWithWarehouse() {
    return __awaiter(this, void 0, void 0, function* () {
        const transaction = yield db_1.default.transaction();
        try {
            // Fetch external stock levels
            const externalStockLevels = yield fetchExternalStockLevels();
            for (const product of externalStockLevels) {
                // Assuming the external system provides product IDs and stock levels
                const { productId, stockLevel } = product;
                // Find the corresponding local inventory entry
                const localInventory = yield Inventory_1.Inventory.findOne({ where: { productId }, transaction });
                if (!localInventory) {
                    console.warn(`Local inventory entry not found for productId: ${productId}`);
                    continue;
                }
                // Check if the stock levels differ
                if (localInventory.quantity !== stockLevel) {
                    // Update local inventory to match external stock levels
                    localInventory.quantity = stockLevel;
                    yield localInventory.save({ transaction });
                    console.log(`Updated inventory for productId ${productId}: ${localInventory.quantity}`);
                }
            }
            // Commit the transaction
            yield transaction.commit();
            console.log('Inventory sync completed successfully');
        }
        catch (error) {
            // Rollback the transaction in case of any errors
            yield transaction.rollback();
            console.error('Inventory sync failed:', error.message);
        }
    });
}
// Schedule the sync job to run every hour
node_cron_1.default.schedule('0 * * * *', () => {
    console.log('Running scheduled inventory sync job...');
    syncInventoryWithWarehouse();
});
