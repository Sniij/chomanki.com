import axios from 'axios';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

instance.interceptors.request.use(config => {
    config.withCredentials= true;
  return config;
});

export default instance;
