import axios from 'axios';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const LOCAL_BASE_URL = process.env.LOCAL_BASE_URL;
const BASE_URL = process.env.BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const authorization = getCookie("accessToken") ?? "";
instance.interceptors.request.use(config => {
  {authorization &&  config.headers.set('Authorization', authorization)}
  config.withCredentials= true;
  return config;
});

export default instance;
