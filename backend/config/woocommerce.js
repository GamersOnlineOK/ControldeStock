import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import './env.js';

const requiredConfig = [
  'WOOCOMMERCE_URL',
  'WOOCOMMERCE_CONSUMER_KEY',
  'WOOCOMMERCE_CONSUMER_SECRET'
];

const missingConfig = requiredConfig.filter((key) => !process.env[key]);

const createDisabledClient = () => {
  const message = `Faltan variables de entorno para WooCommerce: ${missingConfig.join(', ')}`;

  return {
    get: async () => {
      throw new Error(message);
    },
    put: async () => {
      throw new Error(message);
    },
    post: async () => {
      throw new Error(message);
    },
    delete: async () => {
      throw new Error(message);
    }
  };
};

const WooCommerce = missingConfig.length > 0
  ? createDisabledClient()
  : new WooCommerceRestApi.default({
      url: process.env.WOOCOMMERCE_URL,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
      version: process.env.WOOCOMMERCE_API_VERSION || 'wc/v3'
    });

export default WooCommerce;
