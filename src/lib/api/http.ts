import { AxiosRequestConfig } from 'axios';
import { apiClient, nextApiClient } from './client';

/**
 * GET
 */
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 管理画面用API（/api/admin/**）の場合はNext.jsルート経由で呼び出す
  const client = url.startsWith('/api/admin/') ? nextApiClient : apiClient;
  const res = await client.get<T>(url, config);
  return res.data;
};

/**
 * POST
 */
export const post = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 管理画面用API（/api/admin/**）の場合はNext.jsルート経由で呼び出す
  const client = url.startsWith('/api/admin/') ? nextApiClient : apiClient;
  const res = await client.post<T>(url, data, config);
  return res.data;
};

/**
 * PUT
 */
export const put = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 管理画面用API（/api/admin/**）の場合はNext.jsルート経由で呼び出す
  const client = url.startsWith('/api/admin/') ? nextApiClient : apiClient;
  const res = await client.put<T>(url, data, config);
  return res.data;
};

/**
 * PATCH
 */
export const patch = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 管理画面用API（/api/admin/**）の場合はNext.jsルート経由で呼び出す
  const client = url.startsWith('/api/admin/') ? nextApiClient : apiClient;
  const res = await client.patch<T>(url, data, config);
  return res.data;
};

/**
 * DELETE
 */
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 管理画面用API（/api/admin/**）の場合はNext.jsルート経由で呼び出す
  const client = url.startsWith('/api/admin/') ? nextApiClient : apiClient;
  const res = await client.delete<T>(url, config);
  return res.data;
};

/**
 * FILE UPLOAD
 */
export const uploadFile = async <T>(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 管理画面用API（/api/admin/**）の場合はNext.jsルート経由で呼び出す
  const client = url.startsWith('/api/admin/') ? nextApiClient : apiClient;
  // FormDataの場合はContent-Typeを削除してaxiosに自動設定させる
  const headers = config?.headers ? { ...config.headers } : {};
  if ('Content-Type' in headers) {
    delete (headers as Record<string, unknown>)['Content-Type'];
  }
  const res = await client.post<T>(url, formData, {
    ...config,
    headers,
  });
  return res.data;
};

/**
 * POST to Next.js API Route Handler
 */
export const postToNextApi = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const res = await nextApiClient.post<T>(url, data, config);
  return res.data;
};
