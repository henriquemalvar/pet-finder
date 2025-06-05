import { PetForm } from '@/components/PetForm';
import { Container } from '@/components/ui/Container';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { uploadService } from '@/services/uploadService';
import { Pet, PetType } from '@/types/database';
import { router } from 'expo-router';
import { useState } from 'react';

export default function CreatePet() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>) => {
    try {
      setLoading(true);

      let imageUrl: string | undefined = undefined;

      // Se houver uma imagem, tenta fazer upload
      if (data.image) {
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: data.image,
            type: 'image/jpeg',
            name: 'photo.jpg',
          } as any);

          const response = await uploadService.uploadFile(formData);
          imageUrl = response.url;
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          showToast.error('Aviso', 'Pet cadastrado, mas não foi possível fazer upload da imagem');
        }
      }

      // Criar o pet
      const pet = await petsService.create({
        ...data,
        type: data.type as PetType,
        image: imageUrl
      });

      showToast.success('Sucesso', 'Pet cadastrado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar pet';
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <PetForm onSubmit={handleSubmit} submitLabel={loading ? 'Cadastrando...' : 'Cadastrar'} />
    </Container>
  );
} 