import axios from 'axios';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const instance = axios.create({
  baseURL: 'https://server.blog.chomanki.com',
  withCredentials: true,
});

instance.interceptors.request.use(config => {
    config.withCredentials= true;
    config.headers.Authorization = getCookie("accessToken") ?? ""
  return config;
});

export default instance;
