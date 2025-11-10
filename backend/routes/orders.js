import express from 'express';
import  productController from '../controllers/orderController.js';

const router = express.Router();

// Verificar stock de un pedido completo
router.post('/check-stock', productController.checkOrderStock);

// Procesar pedido completo (puede ser en paralelo)
router.post('/process', productController.processOrder);

// Procesar pedido en secuencia (más seguro)
router.post('/process-sequential', productController.processOrderSequential);

//sincronizar con productionController
router.get('/incoming', productController.processIncomingOrders);

// sincroniza pedidos completos de WooCommerce
router.get('/sync-completed', productController.syncCompletedOrders);

// Obtener pedidos pendientes
router.get('/pendientes', productController.getPedidosPendientes);

// Obtener pedidos Completados
router.get('/completados', productController.getPedidosCompletados);

// Obtener todos los pedidos
router.get('/all', productController.getAllOrders);

// Actualizar un pedido
router.put('/:orderId', productController.updateOrder);

export default router;