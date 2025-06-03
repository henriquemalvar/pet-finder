import api from '@lib/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  whatsapp: string | null;
  instagram: string | null;
  contactPreference: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User & { token: string }> => {
    console.log('Enviando requisição de login...');
    const response = await api.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    console.log('Resposta da API:', response.data);

    if (!response.data.user || !response.data.token) {
      console.error('Dados incompletos:', response.data);
      throw new Error('Dados do usuário incompletos na resposta');
    }

    return {
      ...response.data.user,
      token: response.data.token
    };
  },

  register: async (data: RegisterData): Promise<User & { token: string }> => {
    const response = await api.post<LoginResponse>('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!response.data.user || !response.data.token) {
      throw new Error('Dados do usuário incompletos na resposta');
    }

    return {
      ...response.data.user,
      token: response.data.token
    };
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
}; 