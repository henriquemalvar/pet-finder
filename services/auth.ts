import { showToast } from '@/components/ui/Toast';
import { AuthResponse, UserWithToken } from '@/types/auth';
import api from '@lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@pet-finder:user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Funções de persistência
export const getToken = async (): Promise<string | null> => {
  try {
    const user = await getUser();
    return user?.token || null;
  } catch (error) {
    showToast.error('Erro', 'Erro ao obter token');
    return null;
  }
};

export const getUser = async (): Promise<UserWithToken | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    showToast.error('Erro', 'Erro ao obter usuário');
    return null;
  }
};

export const saveUser = async (user: UserWithToken): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    showToast.error('Erro', 'Erro ao salvar usuário');
    throw error;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem('@token');
  } catch (error) {
    showToast.error('Erro', 'Erro ao remover usuário');
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getUser();
    return !!user;
  } catch (error) {
    showToast.error('Erro', 'Erro ao verificar autenticação');
    return false;
  }
};

// Serviço de autenticação
export const authService = {
  login: async (credentials: LoginCredentials): Promise<UserWithToken> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    if (!response.data.user || !response.data.token) {
      throw new Error('Dados do usuário incompletos na resposta');
    }

    return {
      ...response.data.user,
      token: response.data.token
    };
  },

  register: async (data: RegisterData): Promise<UserWithToken> => {
    const response = await api.post<AuthResponse>('/auth/register', data);

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