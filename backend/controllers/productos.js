import Product from '../models/Product.js';
import Category from '../models/categories.js';
import WooCommerce from '../config/woocommerce.js';

const sincronizarProductosWoocommerce = async (req, res) => {
  try {
    let allProducts = [];
    let page = 1;
    let morePagesAvailable = true;

    while (morePagesAvailable) {
      const { data: products } = await WooCommerce.get('products', {
        per_page: 100,
        page,
        status: 'publish',
        _fields: [
          'id',
          'sku',
          'name',
          'description',
          'price',
          'stock_quantity',
          'categories',
          'status'
        ].join(',')
      });

      if (products.length > 0) {
        allProducts = allProducts.concat(products);
        page++;
      } else {
        morePagesAvailable = false;
      }
    }

    const batchSize = 50;
    const savedProducts = [];

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (product) => {
          try {
            const normalizedSku = product.sku?.trim();
            const categoryName = product.categories?.[0]?.name || 'Sin categoria';
            const category = await Category.findOneAndUpdate(
              { name: categoryName },
              { name: categoryName, isActive: true },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const productData = {
              woocommerceId: product.id,
              code: `PF${product.id}`,
              name: product.name,
              type: 'PF',
              unit: 'unidad',
              description: product.description,
              price: parseFloat(product.price) || 0,
              category: category._id,
              isActive: product.status === 'publish'
            };
            if (normalizedSku) productData.sku = normalizedSku;

            const savedProduct = await Product.findOneAndUpdate(
              normalizedSku
                ? { $or: [{ woocommerceId: product.id }, { sku: normalizedSku }] }
                : { woocommerceId: product.id },
              {
                $set: productData,
                $setOnInsert: {
                  currentStock: product.stock_quantity || 0,
                  minStock: 0
                }
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
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
    console.error('Error en la sincronizacion de productos:', error);
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
