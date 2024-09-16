import { Request, Response } from 'express';
import { Product } from '../models/Product';
// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        throw new Error('Please provide a name, description and price');
    }
    const product = await Product.create({ name, description, price });
    return res.status(201).json({ok:true,message:'Created Product !',product});
  } catch (error:any) {
    console.error(error);
    return res.status(500).json({ok:false, error: 'Failed to create product',message: error.message });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ok:true,message:'Fetched Products !',products});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok:false,error: 'Failed to fetch products' });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        throw new Error('Please provide a name, description and price');
    }
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ ok:false,error: 'Product not found' });
    }

    product.name = name;
    product.description = description;
    product.price = price;

    await product.save();
    return res.status(200).json({ok:true,message:'Updated Product !',product});
  } catch (error:any) {
    console.error(error);
    return res.status(500).json({ok:false, error: 'Failed to update product' ,message:error.message});
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ok:false, error: 'Product not found' });
    }

    await product.destroy();
    return res.status(200).json({ ok:true,message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok:true,error: 'Failed to delete product' });
  }
};
