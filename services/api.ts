import { UserWithToken } from '@/types/auth';
import { Pet, PetSize, PetType } from '@/types/database';
import api from '@lib/axios';

// Tipos
// Autenticação
export const authService = {
  login: async (email: string, password: string): Promise<UserWithToken> => {
    const response = await api.post<UserWithToken>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<UserWithToken> => {
    const response = await api.post<UserWithToken>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  resetPassword: async (email: string): Promise<void> => {
    await api.post('/auth/reset-password', { email });
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

// Pets
export const petService = {
  list: async (): Promise<Pet[]> => {
    const response = await api.get<Pet[]>('/pets');
    return response.data;
  },

  search: async (params: {
    query?: string;
    type?: PetType;
    age?: string;
    size?: PetSize;
  }): Promise<Pet[]> => {
    const response = await api.get<Pet[]>('/pets/search', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Pet> => {
    const response = await api.get<Pet>(`/pets/${id}`);
    return response.data;
  },

  create: async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> => {
    const response = await api.post<Pet>('/pets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Pet>): Promise<Pet> => {
    const response = await api.put<Pet>(`/pets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pets/${id}`);
  },
};

// Mensagens
export const messageService = {
  send: async (petId: string, data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<void> => {
    await api.post(`/pets/${petId}/messages`, data);
  },
}; 