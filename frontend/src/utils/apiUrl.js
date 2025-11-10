const baseURL =()=> {
    if (typeof window !== 'undefined' && 
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')) {
    return 'http://simi-pry.com.ar:3200/api/';
  }
  return 'http://localhost:3200/api/';
}
const URLJSON = {
  baseURL: baseURL()
}
const URL = URLJSON.baseURL;

export default URL;