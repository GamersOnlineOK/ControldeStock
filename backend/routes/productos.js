import express from 'express';
const router = express.Router();
import productController from '../controllers/productController.js';
import  productosUpdate  from '../controllers/productos.js';

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/all', productController.getAllProducts);
router.patch('/:productId/stock', productController.updateStock);
router.get('/syncronizar', productosUpdate.sincronizarProductosWoocommerce);

export default router;