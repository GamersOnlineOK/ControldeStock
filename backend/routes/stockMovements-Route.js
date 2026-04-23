
import express from 'express';
const router = express.Router();
import stockmovement from '../controllers/stockMovement-Controller.js';


router.get('/', stockmovement.getStockMovements);
router.get('/:id', stockmovement.getById);

export default router;
