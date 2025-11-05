// controllers/productionController.js
import Product from '../models/Product.js';
import BOM from '../models/BOM.js';
import StockMovement from '../models/StockMovement.js';

// Función auxiliar: Verificar stock de componentes directos
const checkDirectComponentsStock = async (bom, quantity) => {
  let canUseDirect = true;
  const missingComponents = [];

  for (let component of bom.components) {
    const requiredQty = component.quantity * quantity * (1 + (component.waste || 0));
    console.log(requiredQty);
    
    if (component.product.currentStock < requiredQty) {
      canUseDirect = false;
      missingComponents.push({
        product: component.product,
        required: requiredQty,
        available: component.product.currentStock,
        missing: requiredQty - component.product.currentStock
      });
    }
  }

  return { canUseDirect, missingComponents };
};

// Función auxiliar: Consumir componentes directos
const consumeDirectComponents = async (bom, quantity, product, user) => {
  const movements = [];

  for (let component of bom.components) {
    const requiredQty = component.quantity * quantity * (1 + (component.waste || 0));
    const previousStock = component.product.currentStock;
    
    component.product.currentStock -= requiredQty;
    await component.product.save();

    const movement = await StockMovement.create({
      product: component.product._id,
      type: 'CONSUMO',
      quantity: requiredQty,
      reference: `PROD-${product.code}-${Date.now()}`,
      notes: `Consumo directo para producción de ${product.name}`,
      previousStock: previousStock,
      newStock: component.product.currentStock,
      user: user
    });

    movements.push({
      movement,
      component: {
        product: component.product,
        quantity: requiredQty
      }
    });
  }

  return movements;
};

// Función auxiliar: Explosión completa de componentes
const explodeComponents = async (productId, quantity, level = 0) => {
  const product = await Product.findById(productId);
  const bom = await BOM.findOne({ product: productId }).populate('components.product');
  
  let components = [];

  if (bom && level < 10) {
    for (let component of bom.components) {
      const requiredQty = component.quantity * quantity * (1 + (component.waste || 0));
      
      if (component.product.type === 'MPE') {
        const subComponents = await explodeComponents(
          component.product._id, 
          requiredQty, 
          level + 1
        );
        components = components.concat(subComponents);
      } else {
        components.push({
          product: component.product,
          quantity: requiredQty,
          type: 'MP',
          level: level
        });
      }
    }
  }

  return components;
};

// Función auxiliar: Consolidar componentes por producto
const consolidateComponents = (components) => {
  const consolidated = {};
  
  components.forEach(comp => {
    const productId = comp.product._id.toString();
    if (!consolidated[productId]) {
      consolidated[productId] = {
        product: comp.product,
        quantity: 0,
        type: comp.type
      };
    }
    consolidated[productId].quantity += comp.quantity;
  });
  
  return Object.values(consolidated);
};

// Producción con modo automático CORREGIDO ANTERIOR
// const processProductionAuto = async (req, res) => {
//   try {
//     const { productId, quantity, user, notes } = req.body;

//     console.log('Iniciando producción automática para:', productId, 'Cantidad:', quantity);

//     // const product = await Product.findById(productId);
//     const product = await Product.findOne({ woocommerceId: productId });
//     console.log('Producto encontrado:', product);
//     if (!product || !['PF', 'MPE'].includes(product.type)) {
      
//       return res.status(400).json({ error: 'Producto no válido para producción' });
//     }

//     // Obtener BOM del producto
//     const bom = await BOM.findOne({ product: product._id }).populate('components.product');
//     if (!bom) {
//       return res.status(404).json({ error: 'BOM no encontrado' });
//     }

//     console.log('BOM encontrado con componentes:', bom.components.length);

//     // PRIMERO: Verificar si podemos usar componentes directos (MPE + MP)
//     const { canUseDirect, missingComponents } = await checkDirectComponentsStock(bom, quantity);
    
//     let productionMode = '';
//     let consumptionMovements = [];

//     if (canUseDirect) {
//       console.log('Usando componentes DIRECTOS (MPE + MP)');
//       productionMode = 'DIRECTO';
      
//       // Consumir componentes directos
//       const movements = await consumeDirectComponents(bom, quantity, product, user);
//       consumptionMovements = movements;

//     } else {
//       console.log('No hay stock suficiente de componentes directos, usando EXPLOSIÓN');
      
//       // Verificar si los componentes que faltan son MPE
//       const missingMPE = missingComponents.filter(mc => 
//         mc.product.type === 'MPE' && mc.available < mc.required
//       );

//       if (missingMPE.length > 0) {
//         console.log('Explotando MPE faltantes:', missingMPE.map(m => m.product.name));
      
//         // Obtener todos los componentes con explosión
//         const allComponents = await explodeComponents(product._id, quantity);
        
        
//         const consolidatedComponents = consolidateComponents(allComponents);
//         console.log(consolidatedComponents);
        
//         console.log('Componentes después de explosión:', consolidatedComponents.length);

//         // Verificar stock de componentes explotados (solo MP)
//         for (let component of consolidatedComponents) {
//           if (component.product.currentStock < component.quantity) {
//             return res.status(400).json({ 
//               error: `Stock insuficiente incluso con explosión: ${component.product.name}`,
//               details: {
//                 product: component.product.name,
//                 required: component.quantity,
//                 available: component.product.currentStock,
//                 missing: component.quantity - component.product.currentStock
//               }
//             });
//           }
//         }

//         // CONSUMIR COMPONENTES EXPLOTADOS (solo MP)
//         for (let component of consolidatedComponents) {
//           const previousStock = component.product.currentStock;
//           component.product.currentStock -= component.quantity;
//           await component.product.save();

//           const movement = await StockMovement.create({
//             product: component.product._id,
//             type: 'CONSUMO',
//             quantity: component.quantity,
//             reference: `PROD-${product.code}-${Date.now()}`,
//             notes: `Consumo por explosión para producción de ${product.name}`,
//             previousStock: previousStock,
//             newStock: component.product.currentStock,
//             user: user
//           });

//           consumptionMovements.push({
//             movement,
//             component: {
//               product: component.product,
//               quantity: component.quantity
//             }
//           });
//         }

//         productionMode = 'EXPLOSION';
//       } else {
//         return res.status(400).json({ 
//           error: 'Stock insuficiente de componentes MP',
//           missingComponents: missingComponents
//         });
//       }
//     }

//     // PRODUCIR EL PRODUCTO FINAL
//     const previousStock = product.currentStock;
//     product.currentStock += quantity;
//     await product.save();

//     const productionMovement = await StockMovement.create({
//       product: product._id,
//       type: 'PRODUCCION',
//       quantity: quantity,
//       reference: `PROD-${product.code}-${Date.now()}`,
//       notes: `${notes || 'Producción'} (Modo: ${productionMode})`,
//       previousStock: previousStock,
//       newStock: product.currentStock,
//       user: user
//     });

//     res.json({
//       message: 'Producción completada exitosamente',
//       product: {
//         _id: product._id,
//         code: product.code,
//         name: product.name,
//         newStock: product.currentStock
//       },
//       productionMode: productionMode,
//       componentsConsumed: consumptionMovements.map(cm => ({
//         product: cm.component.product.code,
//         name: cm.component.product.name,
//         type: cm.component.product.type,
//         quantity: cm.component.quantity
//       })),
//       movements: {
//         consumption: consumptionMovements.map(cm => cm.movement),
//         production: productionMovement
//       }
//     });

//   } catch (error) {
//     console.error('Error en processProductionAuto:', error);
//     res.status(400).json({ error: error.message });
//   }
// };

// Producción con modo automático CORREGIDO ANTERIOR

const processProductionAuto = async (req, res) => {
  try {
    const { productId, quantity, user, notes } = req.body;

  
    console.log('Iniciando producción automática para:', productId, 'Cantidad:', quantity);

    const product = await Product.findOne({ woocommerceId: productId });
    // const product = await Product.findById(  productId );
    console.log('Producto encontrado:', product);
    if (!product || !['PF', 'MPE'].includes(product.type)) {
      return res.status(400).json({ error: 'Producto no válido para producción' });
    }

    // Obtener BOM del producto
    const bom = await BOM.findOne({ product: product._id }).populate('components.product');
    if (!bom) {
      return res.status(404).json({ error: 'BOM no encontrado' });
    }

    console.log('BOM encontrado con componentes:', bom.components.length);

    // VERIFICAR STOCK DE COMPONENTES DIRECTOS
    const { canUseDirect, missingComponents } = await checkDirectComponentsStock(bom, quantity);
    
    let productionMode = '';
    let consumptionMovements = [];

    if (canUseDirect) {
      console.log('Usando componentes DIRECTOS (MPE + MP)');
      productionMode = 'DIRECTO';
      
      // Consumir componentes directos
      const movements = await consumeDirectComponents(bom, quantity, product, user);
      consumptionMovements = movements;

    } else {
      console.log('No hay stock suficiente de componentes directos');
      
      // 🚨 MODIFICACIÓN CLAVE: Verificar específicamente qué falta
      const missingMPE = missingComponents.filter(mc => 
        mc.product.type === 'MPE' && mc.available < mc.required
      );

      const missingMP = missingComponents.filter(mc => 
        mc.product.type === 'MP' && mc.available < mc.required
      );

      // 🚨 SI FALTAN MPE, CANCELAR DIRECTAMENTE - SIN EXPLOSIÓN
      if (missingMPE.length > 0) {
        console.log('Faltan MPE, cancelando producción:', missingMPE.map(m => m.product.name));
        
        return res.status(400).json({ 
          error: 'Stock insuficiente de productos semi-elaborados (MPE)',
          details: {
            message: 'No se puede proceder con la producción por falta de MPE',
            missingMPE: missingMPE.map(m => ({
              product: m.product.name,
              code: m.product.code,
              required: m.required,
              available: m.available,
              missing: m.required - m.available
            })),
            instruction: 'Produzca primero los MPE faltantes antes de continuar'
          }
        });
      }

      // 🚨 SOLO PERMITIR SI SOLO FALTAN MP (materia prima directa)
      if (missingMP.length > 0) {
        console.log('Faltan solo MP, procediendo con explosión:', missingMP.map(m => m.product.name));
        
        // Obtener todos los componentes con explosión
        const allComponents = await explodeComponents(product._id, quantity);
        const consolidatedComponents = consolidateComponents(allComponents);
        
        console.log('Componentes después de explosión:', consolidatedComponents.length);

        // Verificar stock de componentes explotados (solo MP)
        for (let component of consolidatedComponents) {
          if (component.product.currentStock < component.quantity) {
            return res.status(400).json({ 
              error: `Stock insuficiente incluso con explosión: ${component.product.name}`,
              details: {
                product: component.product.name,
                required: component.quantity,
                available: component.product.currentStock,
                missing: component.quantity - component.product.currentStock
              }
            });
          }
        }

        // CONSUMIR COMPONENTES EXPLOTADOS (solo MP)
        for (let component of consolidatedComponents) {
          const previousStock = component.product.currentStock;
          component.product.currentStock -= component.quantity;
          await component.product.save();

          const movement = await StockMovement.create({
            product: component.product._id,
            type: 'CONSUMO',
            quantity: component.quantity,
            reference: `PROD-${product.code}-${Date.now()}`,
            notes: `Consumo por explosión para producción de ${product.name}`,
            previousStock: previousStock,
            newStock: component.product.currentStock,
            user: user
          });

          consumptionMovements.push({
            movement,
            component: {
              product: component.product,
              quantity: component.quantity
            }
          });
        }

        productionMode = 'EXPLOSION';
      } else {
        // Caso inesperado - no debería llegar aquí
        return res.status(400).json({ 
          error: 'Error inesperado en verificación de stock',
          missingComponents: missingComponents
        });
      }
    }

    // PRODUCIR EL PRODUCTO FINAL (solo si llegamos aquí)
    const previousStock = product.currentStock;
    product.currentStock += quantity;
    await product.save();

    const productionMovement = await StockMovement.create({
      product: product._id,
      type: 'PRODUCCION',
      quantity: quantity,
      reference: `PROD-${product.code}-${Date.now()}`,
      notes: `${notes || 'Producción'} (Modo: ${productionMode})`,
      previousStock: previousStock,
      newStock: product.currentStock,
      user: user
    });

    res.json({
      message: 'Producción completada exitosamente',
      product: {
        _id: product._id,
        code: product.code,
        name: product.name,
        newStock: product.currentStock
      },
      productionMode: productionMode,
      componentsConsumed: consumptionMovements.map(cm => ({
        product: cm.component.product.code,
        name: cm.component.product.name,
        type: cm.component.product.type,
        quantity: cm.component.quantity
      })),
      movements: {
        consumption: consumptionMovements.map(cm => cm.movement),
        production: productionMovement
      }
    });

  } catch (error) {
    console.error('Error en processProductionAuto:', error);
    res.status(400).json({ error: error.message });
  }
};

// Verificar stock con ambos modos
const checkStockAdvanced = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const bom = await BOM.findOne({ product: productId }).populate('components.product');
    if (!bom) {
      return res.status(404).json({ error: 'BOM no encontrado' });
    }

    // Verificar modo directo
    const { canUseDirect, missingComponents } = await checkDirectComponentsStock(bom, quantity);
    
    // Verificar modo explosión
    const allComponents = await explodeComponents(productId, quantity);
    const consolidatedComponents = consolidateComponents(allComponents);
    
    let canUseExplosion = true;
    const explosionMissing = [];

    for (let component of consolidatedComponents) {
      if (component.product.currentStock < component.quantity) {
        canUseExplosion = false;
        explosionMissing.push({
          product: component.product,
          required: component.quantity,
          available: component.product.currentStock,
          missing: component.quantity - component.product.currentStock
        });
      }
    }

    res.json({
      product: {
        _id: product._id,
        code: product.code,
        name: product.name,
        quantity: quantity
      },
      modes: {
        direct: {
          canUse: canUseDirect,
          missingComponents: missingComponents
        },
        explosion: {
          canUse: canUseExplosion,
          missingComponents: explosionMissing
        }
      },
      recommendation: canUseDirect ? 'DIRECTO' : (canUseExplosion ? 'EXPLOSION' : 'NO_STOCK')
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default{
    checkStockAdvanced,
    processProductionAuto
};