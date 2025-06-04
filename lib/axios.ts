import axios from 'axios';
import { getToken } from './token';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Tempo de conexão esgotado'));
    }

    if (!error.response) {
      return Promise.reject(new Error('Erro de conexão com o servidor'));
    }

    if (error.response.status === 401) {
      // Não precisamos mais remover o token aqui pois o removeUser já faz isso
      // e o token está dentro do objeto user
    }

    return Promise.reject(error);
  }
);

export default api; 