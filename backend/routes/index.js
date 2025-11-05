// routes/index.js
import express from 'express';
const router = express.Router();

import productRoutes from './productos.js';
import bomRoutes from './bom.js';
import productionRoutes from './production.js';
import orderRoutes from './orders.js';

router.use('/products', productRoutes);
router.use('/bom', bomRoutes);
router.use('/production', productionRoutes);
router.use('/orders', orderRoutes); 

export default router;