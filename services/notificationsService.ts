import api from '@lib/axios';

export const notificationsService = {
  registerToken: async (token: string): Promise<void> => {
    console.log('[POST] /notifications/register');
    await api.post('/notifications/register', { token });
  },

  notifyNearbyUsers: async (postId: string): Promise<void> => {
    console.log('[POST] /notifications/nearby');
    await api.post('/notifications/nearby', { postId });
  },
};
