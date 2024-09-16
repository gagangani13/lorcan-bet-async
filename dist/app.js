"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./sentry");
const Sentry = __importStar(require("@sentry/node"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const morgan_1 = __importDefault(require("morgan"));
const express_status_monitor_1 = __importDefault(require("express-status-monitor"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('combined')); // Logging with Morgan
if (process.env.SENTRY_DSN_URL) {
    Sentry.setupExpressErrorHandler(app);
}
// To see the performance of backend
app.use((0, express_status_monitor_1.default)());
app.get('/status', (0, express_status_monitor_1.default)());
//routes
app.use('/product', productRoutes_1.default);
app.use('/inventory', inventoryRoutes_1.default);
app.use('/order', orderRoutes_1.default);
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
// Sync Database
db_1.default.sync()
    .then(() => {
    console.log('Database & tables synced');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error syncing database:', err);
});
exports.default = app;
