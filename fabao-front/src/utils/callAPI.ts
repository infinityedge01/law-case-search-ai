import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

export interface APIError {
  status: number;
  message: string;
  details?: any;
}

export interface RequestConfig extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * 发送GET请求
 * @param endpoint API端点
 * @param params 查询参数
 * @param config 请求配置
 * @returns 返回响应数据
 */
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  config?: RequestConfig
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response: AxiosResponse<T> = await axios.get(url, {
      params,
      timeout: config?.timeout || 30000, // 默认30秒超时
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });

    return response.data;
  } catch (error: any) {
    // 处理错误
    handleApiError(error);
    throw error;
  }
}

/**
 * 发送POST请求
 * @param endpoint API端点
 * @param data 请求体数据
 * @param config 请求配置
 * @returns 返回响应数据
 */
export async function apiPost<T = any, D = any>(
  endpoint: string,
  data?: D,
  config?: RequestConfig
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response: AxiosResponse<T> = await axios.post(url, data, {
      timeout: config?.timeout || 30000, // 默认30秒超时
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      ...config,
    });

    return response.data;
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
}

/**
 * 处理API错误
 * @param error Axios错误对象
 */
function handleApiError(error: any): never {
  const apiError: APIError = {
    status: error.response?.status || 500,
    message: '请求失败',
    details: undefined,
  };

  if (error.response) {
    apiError.message = error.response.data?.message || `请求失败 (${error.response.status})`;
    apiError.details = error.response.data;
  } else if (error.request) {
    apiError.message = '服务器无响应';
  } else {
    apiError.message = error.message || '请求配置错误';
  }

  console.error('API请求错误:', apiError);

  throw apiError;
}

/**
 * 创建一个取消令牌
 * @returns 取消令牌
 */
export function createCancelToken() {
  return axios.CancelToken.source();
}

export default {
  get: apiGet,
  post: apiPost,
  createCancelToken,
};