const normalizeURL = (url) => (url.endsWith('/') ? url : `${url}/`);

const isLocalHostname = (hostname) => (
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1'
);

const getSafeApiURL = (url) => {
  if (typeof window === 'undefined') {
    return normalizeURL(url);
  }

  const parsedURL = new URL(url, window.location.origin);
  const isLocalApi = isLocalHostname(parsedURL.hostname);

  if (window.location.protocol === 'https:' && parsedURL.protocol === 'http:' && !isLocalApi) {
    parsedURL.protocol = 'https:';
  }

  return normalizeURL(parsedURL.toString());
};

const baseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) {
    return getSafeApiURL(envURL);
  }

  if (typeof window !== 'undefined' &&
    !isLocalHostname(window.location.hostname)) {
    return 'https://simi-pry.com.ar:3200/api/';
  }

  return 'http://localhost:3200/api/';
};

const URLJSON = {
  baseURL: baseURL()
};
const URL = URLJSON.baseURL;

export default URL;
