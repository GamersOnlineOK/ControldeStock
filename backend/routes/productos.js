import express from 'express';
const router = express.Router();
import productController from '../controllers/productController.js';
import  productosUpdate  from '../controllers/productos.js';

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:productId', productController.getById);
router.patch('/:productId', productController.patchProductoByID);
router.get('/all', productController.getAllProducts);
router.patch('/:productId/stock', productController.updateStock);
router.patch('/:productId/stock/elaborada', productController.updateStockElaborada);
router.get('/syncronizar', productosUpdate.sincronizarProductosWoocommerce);
router.patch('/:productId/stock/reducir', productController.reduceStock);

export default router;