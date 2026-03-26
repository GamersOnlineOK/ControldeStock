// Poner el stock en cero
import express from 'express';
const router = express.Router();
import stockCero from '../controllers/productController.js';

// Poner el stock en cero
router.post('/poner-stock-cero', stockCero.stockCero);
router.get('/poner-stock-cero', (req, res) => {
  res.status(200).json({ message: 'Endpoint para poner el stock en cero. Usa POST para ejecutar la acción.' });
});



export default router;
