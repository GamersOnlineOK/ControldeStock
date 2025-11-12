import Product from '../models/Product.js';
import BOM from '../models/BOM.js';
import StockMovement from '../models/StockMovement.js';
import Order from '../models/pedidos.js';
import productController from './productionController.js';
import WooCommerce from '../config/woocommerce.js';
import cambiaEstadoPedido from './cambiaEstadoPedido.js';

// Función para procesar un pedido completo
const processOrder = async (req, res) => {
  try {
    const { orderNumber, items, user, notes } = req.body;

    console.log(`Procesando pedido ${orderNumber} con ${items.length} items`);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe contener items' });
    }

    // 1. Verificar stock para todos los items del pedido
    const stockVerification = [];
    let canProduceAll = true;

    for (const item of items) {
      const stockCheck = await checkStockForOrder(item.productId, item.quantity);
      stockVerification.push(stockCheck);
      
      if (!stockCheck.canProduce) {
        canProduceAll = false;
      }
    }

    // 2. Si no se puede producir todo, retornar error con detalles
    if (!canProduceAll) {
      return res.status(400).json({
        error: 'Stock insuficiente para completar el pedido',
        orderNumber,
        stockVerification,
        details: stockVerification.filter(item => !item.canProduce)
      });
    }

    // 3. Procesar producción para cada item
    const productionResults = [];
    const failedProductions = [];

    for (const item of items) {
      try {
        // Crear un mock req object para processProductionAuto
        const productionReq = {
          body: {
            productId: item.productId,
            quantity: item.quantity,
            user: user,
            notes: `Pedido: ${orderNumber} - ${item.notes || ''}`
          }
        };

        // Crear un mock res object para capturar la respuesta
        const productionRes = {
          json: (result) => {
            productionResults.push({
              item,
              result: {
                ...result,
                orderNumber
              }
            });
          }
        };

        // Ejecutar producción
        await processProductionAuto(productionReq, productionRes);
        
      } catch (error) {
        console.error(`Error produciendo ${item.productId}:`, error);
        failedProductions.push({
          item,
          error: error.message
        });
      }
    }

    // 4. Si hay producciones fallidas, manejar rollback o retornar error parcial
    if (failedProductions.length > 0) {
      return res.status(207).json({ // 207 Multi-Status
        message: 'Pedido procesado parcialmente',
        orderNumber,
        successful: productionResults.length,
        failed: failedProductions.length,
        productionResults,
        failedProductions,
        warning: 'Algunos items no pudieron ser producidos'
      });
    }

    // 5. Retornar éxito completo
    res.json({
      message: 'Pedido procesado exitosamente',
      orderNumber,
      itemsCount: items.length,
      productionResults,
      summary: generateOrderSummary(productionResults)
    });

  } catch (error) {
    console.error('Error en processOrder:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar: Verificar stock para un item del pedido
const checkStockForOrder = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return {
        productId,
        productName: 'No encontrado',
        quantity,
        canProduce: false,
        error: 'Producto no encontrado'
      };
    }

    // Usar la función existente checkStockAdvanced
    const stockCheck = await productController.checkStockAdvanced({
      body: { productId, quantity }
    }, {
      json: (result) => result
    });

    return {
      productId,
      productName: product.name,
      productCode: product.code,
      quantity,
      canProduce: stockCheck.recommendation !== 'NO_STOCK',
      recommendation: stockCheck.recommendation,
      modes: stockCheck.modes
    };

  } catch (error) {
    return {
      productId,
      productName: 'Error',
      quantity,
      canProduce: false,
      error: error.message
    };
  }
};

// Función auxiliar: Generar resumen del pedido
const generateOrderSummary = (productionResults) => {
  const summary = {
    totalItems: productionResults.length,
    totalQuantity: 0,
    productionModes: {},
    products: []
  };

  productionResults.forEach(pr => {
    const quantity = pr.item.quantity;
    const mode = pr.result.productionMode;
    
    summary.totalQuantity += quantity;
    
    // Contar modos de producción
    summary.productionModes[mode] = (summary.productionModes[mode] || 0) + 1;
    
    // Agrupar productos
    summary.products.push({
      productId: pr.item.productId,
      productName: pr.result.product.name,
      quantity: quantity,
      productionMode: mode
    });
  });

  return summary;
};

// Función para verificar stock de pedido sin procesar
const checkOrderStock = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items requeridos' });
    }

    const stockVerification = [];
    let canProduceAll = true;

    for (const item of items) {
      const stockCheck = await checkStockForOrder(item.productId, item.quantity);
      stockVerification.push(stockCheck);
      
      if (!stockCheck.canProduce) {
        canProduceAll = false;
      }
    }

    res.json({
      canProduceAll,
      stockVerification,
      summary: {
        totalItems: items.length,
        canProduce: stockVerification.filter(item => item.canProduce).length,
        cannotProduce: stockVerification.filter(item => !item.canProduce).length
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para procesar pedido en secuencia (un producto a la vez)
const processOrderSequential = async (req, res) => {
  try {
    const { orderNumber, items, user, notes } = req.body;
    console.log(`Procesando pedido ================= ${JSON.stringify(req.body)}`);
    console.log(`Procesando pedido secuencial ${orderNumber}`);

    const results = [];
    const errors = [];

    // Procesar cada item secuencialmente
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      try {
        console.log(`Procesando item ${i + 1}/${items.length}: ${item.productId}`);
        
        const result = await processSingleItem(orderNumber, item, user);
        results.push(result);
        
      } catch (error) {
        console.error(`Error en item ${i + 1}:`, error);
        errors.push({
          item,
          error: error.message,
          position: i + 1
        });
        
        // Opcional: continuar con los siguientes items
        // break; // Si quieres detener en el primer error, descomenta esta línea
      }
    }

    if (errors.length > 0) {
      return res.status(207).json({
        message: 'Pedido procesado con errores',
        orderNumber,
        successful: results.length,
        failed: errors.length,
        results,
        errors
      });
    }
    cambiaEstadoPedido({
      estado:"completed",
      id:orderNumber
    })
    res.json({
      message: 'Pedido procesado exitosamente',
      orderNumber,
      results,
      summary: {
        totalItems: items.length,
        successful: results.length
      },
      success:true
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función auxiliar: Procesar un solo item
const processSingleItem = async (orderNumber, item, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productionReq = {
        body: {
          productId: item.productId,
          quantity: item.quantity,
          user: user,
          notes: `Pedido: ${orderNumber} - ${item.notes || ''}`
        }
      };

      let productionResult = null;

      const productionRes = {
        json: (result) => {
          productionResult = result;
          resolve({
            item,
            result: productionResult
          });
        },
        status: (code) => ({
          json: (error) => {
            reject(new Error(error.error || 'Error en producción'));
          }
        })
      };

      await productController.processProductionAuto(productionReq, productionRes);
      
    } catch (error) {
      reject(error);
    }
  });
};

const processIncomingOrders = async (req, res) => {

  try {
    const { data: orders } = await WooCommerce.get('orders', {
      per_page: 100, // Reducir temporalmente para pruebas
      _fields: ['id', 'billing', 'line_items', 'date_created','customer_note','status'].join(','),
      status: 'on-hold', // Filtrar por pedidos en espera
      //page: 1,
    });

    // Procesar en lotes pequeños para evitar saturación
    const batchSize = 30;
    const savedOrders = [];

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (order) => {
          try {
            const orderData = {
              orderNumber: order.id,
              user:order.billing.email,
              notes: order.customer_note,
              items: order.line_items.map(item => ({
                productId: item.product_id,
                nombre: item.name,
                quantity: item.quantity,
                subtotal: parseFloat(item.price),
                
              })),
              createdAt: order.date_created ? new Date(order.date_created) : new Date(),
            };

            // Guardar con timeout explícito
            const savedOrder = await Order.findOneAndUpdate(
              { orderNumber: order.id },
              orderData,
              { 
                upsert: true,
                new: true,
                maxTimeMS: 10000, // 10 segundos por operación
              }
            );

            return savedOrder;
          } catch (error) {
            console.error(`Error al procesar el pedido ${order.id}:`, error);
            return null;
          }
        })
      );

      savedOrders.push(...batchResults.filter(Boolean));
    }

    res.json({
      success: true,
      message: `${savedOrders.length} pedidos guardados correctamente.`,
      orders: savedOrders,
    });
  } catch (error) {
    console.error('Error en el endpoint /pedidos/incoming:', error);
    res.status(500).json({
      error: 'Error al procesar los pedidos',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  }
  catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

const getPedidosPendientes = async (req, res) => {
  try {
    const pedidos = await Order.find({ status: 'Pendiente' }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos pendientes:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos pendientes' });
  }
};
const getPedidosCompletados = async (req, res) => {
  try {
    const pedidos = await Order.find({ status: 'completed' }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos pendientes:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos pendientes' });
  }
};
const syncCompletedOrders = async (req, res) => {
  try {
    const { data: orders } = await WooCommerce.get('orders', {  
      per_page: 50,
      _fields: ['id', 'billing', 'line_items', 'date_created','customer_note','status'].join(','),
      status: 'completed',
    });
    let syncedCount = 0;
    console.log(orders);
    
    for (const order of orders) {
      const existingOrder = await Order.findOne({ orderNumber: order.id });
      if (existingOrder) {
        existingOrder.status = order.status;
        existingOrder.updatedAt = order.date_modified ? new Date(order.date_modified) : new Date();
        await existingOrder.save();
        syncedCount++;
      }
      else {
        const orderData = {
          orderNumber: order.id,
          status: order.status,
          user:order.billing.email,
          notes: order.customer_note,
          // status: order.status,
          items: order.line_items.map(item => ({
            productId: item.product_id,
            nombre: item.name,
            quantity: item.quantity,
            subtotal: parseFloat(item.price),
          })),
          createdAt: order.date_created ? new Date(order.date_created) : new Date(),
        };
        
        const newOrder = new Order(orderData);
        await newOrder.save();
        syncedCount++;
      }
    }
    res.json({
      success: true,
      message: `${syncedCount} pedidos completados sincronizados.`,
    });
  } catch (error) {
    console.error('Error al sincronizar pedidos completados:', error);
    res.status(500).json({ error: 'Error al sincronizar pedidos completados' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    console.log(orderId);
    console.log(updateData);
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        $set: { 
          "items.$[elem].quantity": updateData 
        } 
      },
      { 
        arrayFilters: [{ "elem.productId": updateData }],
        new: true 
      }
    )
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json({
      message: 'Pedido actualizado exitosamente',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
};



export default{
  processOrder,
  processOrderSequential,
  checkOrderStock,
  processIncomingOrders,
  getAllOrders,
  getPedidosPendientes,
  getPedidosCompletados,
  syncCompletedOrders,
  updateOrder
};