import { PetGender, PetSize, Post, PostStatus, PostType } from '@/types/database';
import api from '@lib/axios';
import axios from 'axios';
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
  userId: string;
  type: PostType;
  status?: PostStatus;
};

export type UpdatePostData = {
  title?: string;
  content?: string;
  type?: PostType;
  status?: PostStatus;
};

export const postsService = {
  async list(filters?: PostFilters): Promise<PostsResponse> {
    console.log('[GET] /posts', filters);
    try {
      const response = await api.get<PostsResponse>('/posts', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Post> {
    console.log('[GET] /posts/' + id);
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
      throw error;
    }
  },

  async create(data: CreatePostData): Promise<Post> {
    console.log('[POST] /posts');
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
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
          throw error;
    }
  },

  async update(id: string, data: UpdatePostData): Promise<Post> {
    console.log('[PUT] /posts/' + id);
    try {
      const response = await api.put<Post>(`/posts/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    console.log('[DELETE] /posts/' + id);
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
      throw error;
    }
  },

  async getByUser(userId: string): Promise<Post[]> {
    console.log('[GET] /posts/user/' + userId);
    try {
      const response = await api.get<Post[]>(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
      throw error;
    }
  },

  async getByPet(petId: string): Promise<Post[]> {
    console.log('[GET] /posts/pet/' + petId);
    try {
      const response = await api.get<Post[]>(`/posts/pet/${petId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[ERRO AXIOS]', JSON.stringify({
          status: error.response?.status,
          data: error.response?.data,
        }));
      } else {
        console.error('[ERRO GERAL]', error);
      }
      throw error;
    }
  },
};