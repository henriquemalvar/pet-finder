import api from '@lib/axios';

export interface Post {
  id: string;
  title: string;
  content: string;
  petId: string;
  userId: string;
  type: 'ADOPTION' | 'LOST' | 'FOUND';
  location: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  pet: {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: string;
    gender: string;
    size: string;
    image: string | null;
    description: string;
    castrated: boolean;
    vaccinated: boolean;
    location: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
  user: {
    id: string;
    name: string;
    avatar: string | null;
    whatsapp: string | null;
    instagram: string | null;
    contactPreference: string | null;
  };
}

interface CreatePostData {
  title: string;
  content: string;
  petId: string;
  type: 'ADOPTION' | 'LOST' | 'FOUND';
  location: string;
}

interface UpdatePostData {
  type?: 'ADOPTION' | 'LOST' | 'FOUND';
  location?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export const postsService = {
  async list(): Promise<Post[]> {
    try {
      const response = await api.get<Post[]>('/posts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: string): Promise<Post> {
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: CreatePostData): Promise<Post> {
    try {
      const response = await api.post<Post>('/posts', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: string, data: UpdatePostData): Promise<Post> {
    try {
      const response = await api.put<Post>(`/posts/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async getByUser(userId: string): Promise<Post[]> {
    try {
      const response = await api.get<Post[]>(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByPet: async (petId: string): Promise<Post[]> => {
    const response = await api.get<Post[]>(`/posts/pet/${petId}`);
    return response.data;
  },
};