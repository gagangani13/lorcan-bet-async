import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Inventory } from '../models/Inventory';
import { processPayment } from '../utils/paymentService'; // Hypothetical payment service function
import sequelize from '../db';

// Create and process an order
export const createOrder = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      throw new Error('Please provide a productId and quantity');
    }

    // Check if product exists in inventory
    const inventory = await Inventory.findOne({ where: { productId }, transaction });
    
    if (!inventory) {
      throw new Error('Product not found in inventory');
    }
    
    if (inventory.quantity < quantity) {
      throw new Error('Insufficient stock in inventory');
    }

    // Create the order first
    const order = await Order.create({ productId, quantity, status: 'pending' }, { transaction });

    // Deduct inventory for reserving
    inventory.quantity -= quantity;
    await inventory.save({ transaction });

    await transaction.commit();  // Commit the transaction

    // Process the order asynchronously
    processOrder(order.id).catch(error => {
      console.error('Error processing order:', error.message);
    });

    return res.status(201).json({ ok: true, message: 'Order created and processing started', order });

  } catch (error: any) {
    await transaction.rollback();  // Rollback if anything goes wrong

    return res.status(500).json({ ok: false, error: 'Failed to create order', message: error.message });
  }
};

// Process the order (inventory reservation + payment)
export const processOrder = async (orderId: number) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Retrieve the order
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error('Order not found');
    }

    // Payment processing (simulated)
    await processPayment(orderId);  // Assume this is an async function

    // Update order status to processed if payment succeeds
    order.status = 'processed';
    await order.save({ transaction });

    await transaction.commit();

    console.log('Payment successful for order', orderId);

  } catch (error: any) {
    await transaction.rollback();
    
    // Log the failure in OrderLogs (you'd implement this as needed)
    console.error('Order processing failed:', error.message);
    
    // Optionally, handle retries or other compensating actions here
  }
};

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    return res.status(200).json({ ok: true, message: 'Fetched Orders!', orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Failed to fetch orders' });
  }
};

// Get  order
export const getOrder = async (req: Request, res: Response) => {
  try {
    const id=req.params.id
    const order = await Order.findOne({where:{id}});
    if (!order) {
      throw new Error("Invalid Order Id");
      
    }
    return res.status(200).json({ ok: true, message: 'Fetched Order!', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Failed to fetch orders' });
  }
};
