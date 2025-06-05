import api from '@lib/axios';

export const uploadService = {
  uploadFile: async (file: File | FormData): Promise<{ url: string }> => {
    console.log('[POST] /uploads');
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append('file', file);
    }

    const response = await api.post<{ url: string }>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadPetPhoto: async (petId: string, file: File | FormData): Promise<{ url: string }> => {
    console.log('[POST] /pets/' + petId + '/photo');
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append('file', file);
    }

    const response = await api.post<{ url: string }>(`/pets/${petId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadUserPhoto: async (file: File | FormData): Promise<{ url: string }> => {
    console.log('[POST] /users/photo');
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append('file', file);
    }

    const response = await api.post<{ url: string }>('/users/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
}; 