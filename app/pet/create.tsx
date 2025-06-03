import { PetForm } from '@/components/PetForm';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { Pet, PetType } from '@/types/database';
import { useAuth } from '@hooks/useAuth';
import { petsService } from '@services/pets';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Container } from '@/components/ui/Container';

export default function CreatePet() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>) => {
    try {
      if (!user?.id) return;
      await petsService.create({
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
      showToast.success('Sucesso', 'Pet cadastrado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar pet';
      showToast.error('Erro', errorMessage);
    }
  };

  return (
    <Container edges={['top']}>
      <Header title="Cadastrar Pet" />
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