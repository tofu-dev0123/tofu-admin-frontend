import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプターを追加
apiClient.interceptors.request.use(
  (config) => {
    // FormDataの場合はContent-Typeを削除してaxiosに自動設定させる
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      // FormDataでない場合のみapplication/jsonを設定
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンス共通処理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Next.jsルートハンドラ用のaxiosインスタンス（baseURLなし）
export const nextApiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプターを追加
nextApiClient.interceptors.request.use(
  (config) => {
    // FormDataの場合はContent-Typeを削除してaxiosに自動設定させる
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      // FormDataでない場合のみapplication/jsonを設定
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンス共通処理
nextApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
