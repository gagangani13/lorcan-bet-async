import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
