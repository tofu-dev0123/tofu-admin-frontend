export const API_ENDPOINTS = {
  login: {
    post: '/api/auth/login',
  },
  logout: {
    post: '/api/auth/logout',
  },
  account: {
    me: '/api/admin/auth/me',
    patch: '/api/admin/account',
    password: '/api/admin/account/password',
    email: '/api/admin/account/email',
  },
  posts: {
    get: '/api/admin/posts/',
    post: '/api/admin/posts/',
    put: (id: number) => `/api/admin/posts/${id}`,
    delete: (id: number) => `/api/admin/posts/${id}`,
    patchStatus: (id: number) => `/api/admin/posts/${id}`,
    edit: (id: number) => `/api/admin/posts/${id}`,
  },
  summary: {
    get: '/api/admin/posts/summary',
  },
  images: {
    post: '/api/admin/images/upload',
    delete: (id: number) => `/api/admin/images/${id}`,
  },
  profile: {
    get: '/api/admin/profile',
    put: '/api/admin/profile',
  },
  timelines: {
    get: '/api/admin/timelines',
    post: '/api/admin/timelines',
    put: (id: number) => `/api/admin/timelines/${id}`,
    delete: (id: number) => `/api/admin/timelines/${id}`,
  },
  products: {
    get: '/api/admin/products',
    post: '/api/admin/products',
    detail: (id: number) => `/api/admin/products/${id}`,
    put: (id: number) => `/api/admin/products/${id}`,
    delete: (id: number) => `/api/admin/products/${id}`,
  },
};
