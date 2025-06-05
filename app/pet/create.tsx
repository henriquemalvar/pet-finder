import { PetForm } from '@/components/PetForm';
import { Container } from '@/components/ui/Container';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { uploadService } from '@/services/uploadService';
import { Pet, PetType } from '@/types/database';
import { useAuth } from '@hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function CreatePet() {
  const router = useRouter();
  const { user } = useAuth();

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível selecionar a imagem');
    }
    return null;
  };

  const handleSubmit = async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>) => {
    try {
      if (!user?.id) return;

      // Primeiro, criar o pet
      const pet = await petsService.create({
        name: data.name,
        type: data.type as PetType,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        size: data.size,
        description: data.description,
        location: data.location,
        castrated: data.castrated,
        vaccinated: data.vaccinated
      });

      // Depois, selecionar e fazer upload da foto
      const image = await handleImagePick();
      if (image) {
        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        await uploadService.uploadPetPhoto(pet.id, formData);
      }

      showToast.success('Sucesso', 'Pet cadastrado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar pet';
      showToast.error('Erro', errorMessage);
    }
  };

  return (
    <Container>
      <PetForm onSubmit={handleSubmit} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 