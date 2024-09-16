import { Request, Response } from 'express';
import { Inventory } from '../models/Inventory';
import { Product } from '../models/Product';

// Create inventory for a product
export const createInventory = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      throw new Error('Please provide a productId and quantity');
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ ok: false, error: 'Product not found' });
    }

    const inventory = await Inventory.create({ productId, quantity });
    return res.status(201).json({ ok: true, message: 'Created Inventory!', inventory });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Failed to create inventory', message: error.message });
  }
};

// Get all inventory
export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findAll();
    return res.status(200).json({ ok: true, message: 'Fetched Inventory!', inventory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Failed to fetch inventory' });
  }
};

// Update inventory for a product
export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw new Error('Please provide a productId and quantity');
    }

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ ok: false, error: 'Inventory not found' });
    }

    inventory.productId = productId;
    inventory.quantity = quantity;
    await inventory.save();

    return res.status(200).json({ ok: true, message: 'Updated Inventory!', inventory });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Failed to update inventory', message: error.message });
  }
};

// Delete inventory for a product
export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ ok: false, error: 'Inventory not found' });
    }

    await inventory.destroy();
    return res.status(200).json({ ok: true, message: 'Inventory deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Failed to delete inventory' });
  }
};
