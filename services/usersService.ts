import { UpdateUserDTO, User } from '@/types/database';
import api from '@lib/axios';

export const usersService = {
  update: async (data: UpdateUserDTO): Promise<User> => {
    const response = await api.put<User>('/users/profile', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },
}; 