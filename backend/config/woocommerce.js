import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const WooCommerce = new WooCommerceRestApi.default({
  url: 'https://pedidos.fabricabaresi.com.ar/',
  consumerKey: 'ck_e1a5def61b34f5a650b790ed903a15a076538120',
  consumerSecret: 'cs_ad4fe39aee9ce8cc8f9eae0811e0691d397309f2',
  version: 'wc/v3'
});

export default WooCommerce;