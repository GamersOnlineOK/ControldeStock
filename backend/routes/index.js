// routes/index.js
import express from 'express';
const router = express.Router();

import productRoutes from './productos.js';
import bomRoutes from './bom.js';
import productionRoutes from './production.js';
import orderRoutes from './orders.js';
import configRoutes from './config.js';
import utilidadesRoutes from './utilidades.js';
import stockMovementRoutes from './stockMovements-Route.js';


router.use('/config', configRoutes);
router.use('/products', productRoutes);
router.use('/bom', bomRoutes);
router.use('/production', productionRoutes);
router.use('/orders', orderRoutes);
router.use('/utilidades', utilidadesRoutes);
router.use('/stock-movements', stockMovementRoutes );

export default router;