import api from '@lib/axios';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  size: string;
  gender: string;
  description: string;
  images: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetData {
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  description: string;
  image?: string;
  castrated: boolean;
  vaccinated: boolean;
  location: string;
}

export interface UpdatePetData extends Partial<CreatePetData> {}

export const getPets = async (): Promise<Pet[]> => {
  try {
    const response = await api.get('/pets');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPetById = async (id: string): Promise<Pet> => {
  try {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPet = async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> => {
  try {
    const response = await api.post('/pets', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePet = async (id: string, data: Partial<Pet>): Promise<Pet> => {
  try {
    const response = await api.put(`/pets/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/pets/${id}`);
  } catch (error) {
    throw error;
  }
};

export const petsService = {
  getByUser: async (userId: string): Promise<Pet[]> => {
    try {
      const { data } = await api.get(`/pets/user/${userId}`);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao buscar pets do usuário');
    }
  },

  getById: async (id: string): Promise<Pet> => {
    const response = await api.get<Pet>(`/pets/${id}`);
    return response.data;
  },

  create: async (data: CreatePetData): Promise<Pet> => {
    const response = await api.post<Pet>('/pets', data).then(res => res.data).catch(err => {
      throw err;
    });
    return response;
  },

  update: async (id: string, data: UpdatePetData): Promise<Pet> => {
    const response = await api.put<Pet>(`/pets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pets/${id}`);
  },
}; 