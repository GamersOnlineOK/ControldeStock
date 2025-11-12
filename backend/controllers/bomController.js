// controllers/bomController.js
import BOM from '../models/BOM.js';
import Product from '../models/Product.js';

// Crear o actualizar BOM
const createOrUpdateBOM = async (req, res) => {
  try {
    const { productId } = req.params;
    const { components, version } = req.body;
    console.log(components);
    
    // Verificar que el producto existe y es PF o MPE
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (!['PF', 'MPE'].includes(product.type)) {
      return res.status(400).json({ error: 'Solo PF y MPE pueden tener BOM' });
    }

    // Verificar que los componentes existen y son del tipo correcto
    for (let component of components) {
      const compProduct = await Product.findById(component.product);
      if (!compProduct) {
        return res.status(404).json({ error: `Componente ${component.product} no encontrado` });
      }

      // Validar tipos según nivel
      if (product.type === 'PF') {
        // PF puede contener MP o MPE
        if (!['MP', 'MPE'].includes(compProduct.type)) {
          return res.status(400).json({ error: 'PF solo puede contener MP o MPE' });
        }
      } else if (product.type === 'MPE') {
        // MPE solo puede contener MP
        if (compProduct.type !== 'MP') {
          return res.status(400).json({ error: 'MPE solo puede contener MP' });
        }
      }
    }

    const bom = await BOM.findOneAndUpdate(
      { product: productId },
      { components, version },
      { new: true, upsert: true }
    ).populate('components.product');

    res.json(bom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener BOM completo con explosión
const getBOMExplosion = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const bom = await BOM.findOne({ product: productId })
      .populate('product')
      .populate('components.product');

    if (!bom) {
      return res.status(404).json({ error: 'Sin Receta' });
    }

    // Función recursiva para explosión completa
    const explodeBOM = async (productId, quantity = 1, level = 0) => {
      const product = await Product.findById(productId);
      const productBOM = await BOM.findOne({ product: productId })
        .populate('components.product');

      const result = {
        product: {
          _id: product._id,
          code: product.code,
          name: product.name,
          type: product.type,
          quantity: quantity,
          level: level
        },
        components: []
      };

      if (productBOM) {
        for (let component of productBOM.components) {
          const subComponents = await explodeBOM(
            component.product._id, 
            quantity * component.quantity, 
            level + 1
          );
          result.components.push(subComponents);
        }
      }

      return result;
    };

    const explodedBOM = await explodeBOM(productId);
    res.json(explodedBOM);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export default  
{
    createOrUpdateBOM,  
    getBOMExplosion
};
