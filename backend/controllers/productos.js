import mongoose from 'mongoose';
import Product from '../models/Product.js';
import WooCommerce from '../config/woocommerce.js';

const sincronizarProductosWoocommerce = async (req, res) => {
  try {
    let allProducts = [];
    let page = 1;
    let morePagesAvailable = true;

    // Recuperar todos los productos paginados desde WooCommerce
    while (morePagesAvailable) {
      const { data: products } = await WooCommerce.get('products', {
        per_page: 100, // Máximo permitido por WooCommerce
        page: page,
        status: 'publish', // Solo productos publicados
        _fields: [
          'id', 'name', 'description', 'price', 'regular_price', 
          'sale_price', 'stock_quantity', 'categories','status'
        ].join(',')
      });

      if (products.length > 0) {
        allProducts = allProducts.concat(products);
        page++;
      } else {
        morePagesAvailable = false;
      }
    }

    // Procesar en lotes para evitar sobrecargar la DB
    const batchSize = 50;
    const savedProducts = [];

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (product) => {
          try {
            const productData = {
              woocommerceId: product.id,
              code: `PF${product.id}`,
              name: product.name,
              type: 'PF',
              unit: 'unidad', // Ajustar según sea necesario
              description: product.description,
              price: parseFloat(product.price),
              regular_price: product.regular_price ? parseFloat(product.regular_price) : null,
              currentStock: 100, // Valor por defecto, ajustar según sea necesario
              categories: product.categories[0].name || 'Sin categoría',
              status: product.status
            };

            const savedProduct = await Product.findOneAndUpdate(
              { woocommerceId: product.id },
              productData,
              { upsert: true, new: true }
            );

            return savedProduct;
          } catch (error) {
            console.error(`Error al procesar el producto ${product.id}:`, error);
            return null;
          }
        })
      );

      savedProducts.push(...batchResults.filter(Boolean));
    }

    res.json({
      success: true,
      message: `${savedProducts.length} productos sincronizados correctamente`,
      totalProducts: allProducts.length,
      savedProducts: savedProducts.length
    });

  } catch (error) {
    console.error('Error en la sincronización de productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al sincronizar productos',
      details: error.message
    });
  }
};

export default {
    sincronizarProductosWoocommerce
};

