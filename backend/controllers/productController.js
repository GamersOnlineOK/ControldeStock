// controllers/productController.js
import Product from '../models/Product.js';
import BOM from '../models/BOM.js';
import StockMovement from '../models/StockMovement.js';

// Crear producto
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los productos con filtros
const getProducts = async (req, res) => {
  try {
    const { type, active } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (active !== undefined) filter.isActive = active === 'true';
    
    const products = await Product.find(filter).sort({ type: 1, name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllProducts = async (req, res) =>{
  try {
    const products = await Product.find();
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Actualizar stock
const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, type, reference, notes, user } = req.body;
    console.log(req.body);
    

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const previousStock = product.currentStock;
    let newStock = previousStock;

    if (type === 'ENTRADA' || type === 'AJUSTE_POSITIVO') {
      newStock = previousStock + quantity;
    } else if (type === 'SALIDA' || type === 'CONSUMO') {
      if (previousStock < quantity) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
      newStock = previousStock - quantity;
    }

    // Actualizar stock del producto
    product.currentStock = newStock;
    await product.save();

    // Registrar movimiento
    const movement = new StockMovement({
      product: productId,
      type,
      quantity,
      reference,
      notes,
      previousStock,
      newStock,
      user
    });
    await movement.save();

    res.json({ product, movement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createProduct,
  getProducts,
  updateStock,
  getAllProducts
};