import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getRefreshUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || '/api';
  return `${base}/auth/refresh`;
}

function isAuthPage(): boolean {
  if (typeof window === 'undefined') return false;
  return /^\/(login|register|forgot-password|reset-password|verify-email)/.test(window.location.pathname);
}

api.interceptors.request.use((config) => {
  const token = accessToken || getAccessTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isAuthPage()) {
        return Promise.reject(error);
      }

      const isMeCheck = originalRequest.url?.includes('/auth/me');
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          getRefreshUrl(),
          {},
          { withCredentials: true }
        );

        if (data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        setAccessToken(null);
        if (!isMeCheck && typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
