import express from 'express';
import { updateInventory, getInventory, createInventory, deleteInventory } from '../controllers/inventoryController';

const router = express.Router();

router.get('/', getInventory);
router.post('/', createInventory);
router.delete('/:id', deleteInventory);
router.put('/:id', updateInventory);

export default router;
