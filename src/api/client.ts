import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// API基础URL，实际项目中应该根据环境变量配置
const BASE_URL = 'https://api.example.com';

// 内存中存储token，用于模拟
let memoryToken: string | null = null;

// 创建axios实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 设置token的函数
export const setToken = (token: string) => {
  memoryToken = token;
};

// 清除token的函数
export const clearToken = () => {
  memoryToken = null;
};

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从内存中获取token
    if (memoryToken && config.headers) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;

      // 处理401未授权错误
      if (status === 401) {
        // 清除内存中的token
        clearToken();
        // 可以在这里添加重定向到登录页面的逻辑
      }

      return Promise.reject(data);
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return Promise.reject({ message: '网络错误，请检查您的网络连接' });
    } else {
      // 请求配置出错
      return Promise.reject({ message: '请求配置错误' });
    }
  },
);

// 通用GET请求
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.get(url, { params, ...config });
};

// 通用POST请求
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.post(url, data, config);
};

// 通用PUT请求
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.put(url, data, config);
};

// 通用DELETE请求
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.delete(url, config);
};

export default apiClient;
