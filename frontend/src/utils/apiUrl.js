const normalizeURL = (url) => (url.endsWith('/') ? url : `${url}/`);

const isLocalHostname = (hostname) => (
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1'
);

const isLocalApiURL = (url) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url);

const baseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;

  if (typeof window === 'undefined') {
    return normalizeURL(envURL || 'http://localhost:3201/api/');
  }

  const isLocalBrowser = isLocalHostname(window.location.hostname);

  if (envURL && (isLocalBrowser || !isLocalApiURL(envURL))) {
    return normalizeURL(envURL);
  }

  if (!isLocalBrowser) {
    return '/api/';
  }

  return 'http://localhost:3201/api/';
};

const URL = baseURL();

export default URL;
