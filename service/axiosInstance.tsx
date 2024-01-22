import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const jsessionId = Cookies.get('JSESSIONID');  
  if (jsessionId) {
    config.headers.Cookie = `JSESSIONID=${jsessionId}`;
  }
  return config;
});

export default instance;
