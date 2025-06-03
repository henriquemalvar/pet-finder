import api from '@lib/axios';

export const notificationsService = {
  registerToken: async (token: string): Promise<void> => {
    await api.post('/notifications/register', { token });
  },

  notifyNearbyUsers: async (postId: string): Promise<void> => {
    await api.post('/notifications/nearby', { postId });
  },
};
