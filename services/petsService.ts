import { Pet, PetGender, PetSize, PetType } from '@/types/database';
import api from '@lib/axios';

export interface CreatePetData {
  name: string;
  type: PetType;
  breed: string;
  age: string;
  gender: PetGender;
  size: PetSize;
  description: string;
  image?: string;
  castrated: boolean;
  vaccinated: boolean;
  location: string;
}

export interface UpdatePetData extends Partial<CreatePetData> {}

export const getPets = async (): Promise<Pet[]> => {
  console.log('[GET] /pets');
  try {
    const response = await api.get('/pets');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPetById = async (id: string): Promise<Pet> => {
  console.log('[GET] /pets/' + id);
  try {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPet = async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> => {
  console.log('[POST] /pets');
  try {
    const response = await api.post('/pets', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePet = async (id: string, data: Partial<Pet>): Promise<Pet> => {
  console.log('[PUT] /pets/' + id);
  try {
    const response = await api.put(`/pets/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePet = async (id: string): Promise<void> => {
  console.log('[DELETE] /pets/' + id);
  try {
    await api.delete(`/pets/${id}`);
  } catch (error) {
    throw error;
  }
};

export const petsService = {
  getByUser: async (userId: string): Promise<Pet[]> => {
    console.log('[GET] /pets/user/' + userId);
    try {
      const { data } = await api.get<Pet[]>(`/pets/user/${userId}`);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao buscar pets do usuário');
    }
  },

  getById: async (id: string): Promise<Pet> => {
    console.log('[GET] /pets/' + id);
    const response = await api.get<Pet>(`/pets/${id}`);
    return response.data;
  },

  create: async (data: CreatePetData): Promise<Pet> => {
    console.log('[POST] /pets');
    const response = await api.post<Pet>('/pets', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePetData): Promise<Pet> => {
    console.log('[PUT] /pets/' + id);
    const response = await api.put<Pet>(`/pets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    console.log('[DELETE] /pets/' + id);
    await api.delete(`/pets/${id}`);
  },
}; 