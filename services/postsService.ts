import { PetGender, PetSize, Post, PostStatus, PostType } from '@/types/database';
import api from '@lib/axios';
import { notificationsService } from './notificationsService';

export type PostFilters = {
  type?: PostType;
  status?: PostStatus;
  location?: string;
  petType?: string;
  petGender?: PetGender;
  petSize?: PetSize;
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
  type: PostType;
  location: string;
  description: string;
  contact: string;
  latitude?: number;
  longitude?: number;
};

export type UpdatePostData = {
  type?: PostType;
  location?: string;
  status?: PostStatus;
};

export const postsService = {
  async list(filters?: PostFilters): Promise<PostsResponse> {
    try {
      const response = await api.get<PostsResponse>('/posts', {
        params: filters,
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

  async getByPet(petId: string): Promise<Post[]> {
    try {
      const response = await api.get<Post[]>(`/posts/pet/${petId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};