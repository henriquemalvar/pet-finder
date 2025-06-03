import { UpdateUserDTO } from '@/types/database';
import api from '@lib/axios';

export const usersService = {
  update: async (data: UpdateUserDTO): Promise<void> => {
    await api.put('/users/profile', data);
  },
}; 