import axios from 'axios';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


export default instance;
