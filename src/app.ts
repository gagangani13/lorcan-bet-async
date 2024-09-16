import "./sentry";
import * as Sentry from "@sentry/node";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./db";
import morgan from "morgan";
import statusMonitor from "express-status-monitor";
import cron from "node-cron";

import { configDotenv } from "dotenv";
configDotenv();

import productRoutes from "./routes/productRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import { syncInventoryWithWarehouse } from "./utils/inventorySyncService";

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;
const WAREHOUSE_API_URL = process.env.WAREHOUSE_API_URL;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 * * * *";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined")); // Logging with Morgan

if (process.env.SENTRY_DSN_URL) {
  Sentry.setupExpressErrorHandler(app);
}

// To see the performance of backend
app.use(statusMonitor());
app.get("/status", statusMonitor());

//routes
app.use("/product", productRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/order", orderRoutes);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Sync Database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables synced");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      // Schedule the sync job to run every hour
      cron.schedule(CRON_SCHEDULE, () => {
        console.log("Running scheduled inventory sync job...");
        if (WAREHOUSE_API_URL) {
          syncInventoryWithWarehouse(WAREHOUSE_API_URL);
        }
      });
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

export default app;
