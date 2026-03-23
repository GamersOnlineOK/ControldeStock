// controllers/productController.js
import Product from '../models/Product.js';
import BOM from '../models/BOM.js';
import StockMovement from '../models/StockMovement.js';

// Crear producto
const createProduct = async (req, res) => {
  const { code, name, type, unit, minStock, currentStock, category, cost, price } = req.body;

  try {
    const product = new Product({
      code,
      name,
      type,
      unit,
      minStock:minStock / 1000,
      currentStock:currentStock / 1000,
      category,
      cost,
      price
    });
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

// Actualizar stock de materia prima (ENTRADA, SALIDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, CONSUMO)
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
// Agrega stock de materia prima elaborada y controla la receta (BOM)
const updateStockElaborada = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, type, reference, notes, user } = req.body;
    console.log(req.body);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const previousStock = product.currentStock;
    let newStock = previousStock + quantity;

    if (type === 'PRODUCCION' || type === 'AJUSTE_POSITIVO') {
      // Verificar receta (BOM)
      const bom = await BOM.findOne({ product: productId }).populate('components.product');
      if (!bom) {
        return res.status(400).json({ error: 'No se encontró la receta (BOM) para este producto' });
      }
      for (const component of bom.components) {
        const requiredQuantity = component.quantity * quantity;
        if (component.product.currentStock < requiredQuantity) {
          return res.status(400).json({ error: `Stock insuficiente para el componente ${component.product.name}` });
        }
      }
      // Descontar componentes
      for (const component of bom.components) {
        const requiredQuantity = component.quantity * quantity;
        component.product.currentStock -= requiredQuantity;
        await component.product.save();
        // Registrar movimiento de salida para cada componente
        const movement = new StockMovement({
          product: component.product._id,
          user: user,
          type: 'PRODUCCION',
          quantity: requiredQuantity,
          reference,
          notes: `Consumo para elaboración de ${product.name}`,
          previousStock: component.product.currentStock + requiredQuantity,
          newStock: component.product.currentStock,
        });

        console.log(movement);
        
        await movement.save();
      }

      // Actualizar stock del producto elaborado
      
    };
    console.log(product.currentStock);
    console.log(newStock);

    product.currentStock = newStock;
    console.log(product.currentStock);
    await product.save();

      res.json({ product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
// Agrega stock de productos finales y controla que tenga existencia de materia prima elaborada y materia prima a parti de la receta (BOM)

// const updateStockFinal = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { quantity, type, reference, notes, user } = req.body;
//     console.log(req.body);

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Producto no encontrado' });
//     }

//     // Verificar stock de materia prima elaborada
//     const bom = await BOM.findOne({ product: productId }).populate('components.product');
//     if (!bom) {
//       return res.status(400).json({ error: 'No se encontró la receta (BOM) para este producto' });
//     }

//     for (const component of bom.components) {
//       if (component.product.currentStock < component.quantity * quantity) {
//         return res.status(400).json({ error: `Stock insuficiente para el componente ${component.product.name}` });
//       }
//     }

//     // Actualizar stock del producto final
//     product.currentStock += quantity;
//     await product.save();

//     res.json({ product });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

export default {
  createProduct,
  getProducts,
  updateStock,
  getAllProducts,
  updateStockElaborada
};