import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 여기에 실제 서버의 URL을 입력하세요.
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const jsessionId = Cookies.get('JSESSIONID');
  if (jsessionId) {
    config.headers.Cookie = `JSESSIONID=${jsessionId}`;
    console.log(jsessionId);
  }
  return config;
});

export default instance;
