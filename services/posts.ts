import { Post } from '@/types/database';
import api from '@lib/axios';
import { notificationsService } from './notifications';

export type PostFilters = {
  type?: 'LOST' | 'FOUND' | 'ADOPTION';
  status?: 'ACTIVE' | 'RESOLVED' | 'CANCELED';
  location?: string;
  petType?: string;
  petGender?: 'MALE' | 'FEMALE';
  petSize?: 'SMALL' | 'MEDIUM' | 'LARGE';
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type PostsResponse = {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreatePostData = {
  title: string;
  content: string;
  petId: string;
  type: 'ADOPTION' | 'LOST' | 'FOUND';
  location: string;
  description: string;
  contact: string;
  latitude?: number;
  longitude?: number;
};

export type UpdatePostData = {
  type?: 'ADOPTION' | 'LOST' | 'FOUND';
  location?: string;
  status?: 'ACTIVE' | 'RESOLVED' | 'CANCELED';
};

export const postsService = {
  async list(filters?: PostFilters): Promise<PostsResponse> {
    try {
      const response = await api.get<PostsResponse>('/posts', {
        params: {
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          type: filters?.type,
          status: filters?.status,
          location: filters?.location,
          petType: filters?.petType,
          petGender: filters?.petGender,
          petSize: filters?.petSize,
          userId: filters?.userId,
          search: filters?.search,
        },
      });
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
      const post = response.data;

      if (post.type === 'LOST' || post.type === 'FOUND') {
        notificationsService.notifyNearbyUsers(post.id).catch(err => {
          console.warn('Falha ao enviar notificação', err);
        });
      }

      return post;
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