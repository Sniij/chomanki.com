import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const accessToken = Cookies.get('accessToken');  
  if (accessToken) {
    config.headers.Cookie = `accessToken=${accessToken}`;
  }
  return config;
});

export default instance;
