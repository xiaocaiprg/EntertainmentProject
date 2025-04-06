import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { getToken, setTokenSync, clearTokenSync } from '../utils/storage';
import { eventEmitter, TOKEN_EXPIRED_EVENT } from '../utils/eventEmitter';
import { PATH } from './services/authService';

const BASE_URL = 'https://junlongpro.com/';

// 创建axios实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.url !== PATH.LOGIN) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('response', response.config.url, response.config.data, response.data);
    if (response.config.url === PATH.LOGIN) {
      const auth = response.headers?.authorization;
      if (auth) {
        setTokenSync(auth);
      }
    }
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      if (status === 410) {
        clearTokenSync();
        eventEmitter.emit(TOKEN_EXPIRED_EVENT);
      }
      return Promise.reject(data);
    } else if (error.request) {
      return Promise.reject({ message: '网络错误，请检查您的网络连接' });
    } else {
      return Promise.reject({ message: '请求配置错误' });
    }
  },
);

// 通用GET请求
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, { params, ...config });
};

// 通用POST请求
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config);
};

// 通用PUT请求
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config);
};

// 通用DELETE请求
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config);
};

export default request;
