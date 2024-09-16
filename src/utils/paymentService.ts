import { Order } from '../models/Order';
import { Inventory } from '../models/Inventory';
import { OrderLog } from '../models/OrderLog';
import sequelize from '../db';


// Function to process payment and handle inventory correctly
export const processPayment = async (orderId: number, inventoryRestored = false,retry=false) => {
  const transaction = await sequelize.transaction();
  try {
    if (!orderId) {
      throw new Error("Provide orderId !");
    }

    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error('Order not found!');
    }

    const inventory = await Inventory.findOne({ where: { productId: order.productId }, transaction });
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
      await inventory.save({ transaction });
    }

    // Simulate random payment success or failure
    const isPaymentSuccessful = Math.random() > 0.5; // 50% success rate

    if (!isPaymentSuccessful) {
      throw new Error("Payment failed");
    }

    // Payment succeeded
    await transaction.commit();

    // Log successful payment
    await OrderLog.create({
      orderId,
      status: "processed",
      processedAt: new Date(),
    });
    await order.update({
      status:'processed'
    })
    console.log("Payment successful for order", orderId);
    return
  } catch (error: any) {
    await transaction.rollback();
    console.error(`Payment failed for order ${orderId}:`, error.message);

    // Add back the reserved inventory in case of failure
    if (error.message=='Payment failed') {
      try {
        const order = await Order.findByPk(orderId);
        if (order) {
          const inventory = await Inventory.findOne({ where: { productId: order.productId } });
          if (inventory) {
            inventory.quantity += order.quantity; // Restore reserved stock
            await inventory.save();
            inventoryRestored=true
          }
        }
      } catch (restoreError) {
        console.error("Failed to restore inventory after payment failure:", restoreError);
      }
    }

    // Log failed payment and retry
    await OrderLog.create({
      orderId,
      status: 'failed',
      errorMessage: error.message,
      processedAt: new Date(),
    });
    if (orderId) {
      await Order.update({
        status:'failed'
      },{where:{id:orderId}})
    }
    
    //  Retry logic 15s
    if ((error.message=='Payment failed' || error.message=='Insufficient stock for retry!') && !retry) {
      setTimeout(() => {
        processPayment(orderId,inventoryRestored,true)
      }, 15*1000);
    }
  }
};

// Gracefully handle server crashes by registering exit handlers
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});
