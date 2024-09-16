import axios from 'axios';
import sequelize from '../db'; 
import { Inventory } from '../models/Inventory';
import dotenv from "dotenv";
dotenv.config();

 


// Function to fetch stock levels from the external warehouse API
async function fetchExternalStockLevels(WAREHOUSE_API_URL:string): Promise<any> {
  try {
    const response = await axios.get(WAREHOUSE_API_URL);
    return response.data; // Assuming the API returns stock data in the response body
  } catch (error:any) {
    console.error('Error fetching stock levels from external warehouse:', error.message);
    throw error;
  }
}

// Function to sync inventory levels
export async function syncInventoryWithWarehouse(WAREHOUSE_API_URL:string) {
  const transaction = await sequelize.transaction();
  try {
    // Fetch external stock levels
    const externalStockLevels = await fetchExternalStockLevels(WAREHOUSE_API_URL);

    for (const product of externalStockLevels) {
      // Assuming the external system provides product IDs and stock levels
      const { productId, stockLevel } = product;

      // Find the corresponding local inventory entry
      const localInventory = await Inventory.findOne({ where: { productId }, transaction });

      if (!localInventory) {
        console.warn(`Local inventory entry not found for productId: ${productId}`);
        continue;
      }

      // Check if the stock levels differ
      if (localInventory.quantity !== stockLevel) {
        // Update local inventory to match external stock levels
        localInventory.quantity = stockLevel;
        await localInventory.save({ transaction });

        console.log(`Updated inventory for productId ${productId}: ${localInventory.quantity}`);
      }
    }

    // Commit the transaction
    await transaction.commit();
    console.log('Inventory sync completed successfully');
  } catch (error:any) {
    // Rollback the transaction in case of any errors
    await transaction.rollback();
    console.error('Inventory sync failed:', error.message);
  }
}


