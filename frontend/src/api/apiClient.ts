import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL ;

console.log(BASE_URL);

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Use direct assignment to set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access, redirecting...');
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(error);
  }
);

export { apiClient };
