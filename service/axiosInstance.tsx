import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://server.blog.chomanki.com',
  withCredentials: true,
});

instance.interceptors.request.use(config => {
    config.withCredentials= true;
  return config;
});

export default instance;
