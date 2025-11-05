// routes/production.js
import express from 'express';
const router = express.Router();
import productionController from '../controllers/productionController.js';

router.post('/check-stock-advanced', productionController.checkStockAdvanced);
router.post('/process', productionController.processProductionAuto);

export default router;