import { PetForm } from '@/components/PetForm';
import { Container } from '@/components/ui/Container';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { Pet, PetType } from '@/types/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EditPet() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPet = useCallback(async () => {
    try {
      if (!id) return;
      const data = await petsService.getById(id);
      setPet(data as unknown as Pet);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar pet';
      showToast.error('Erro', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  const handleSubmit = async (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>) => {
    try {
      if (!id) return;
      await petsService.update(id, {
        ...data,
        type: data.type as PetType,
      });
      showToast.success('Sucesso', 'Pet atualizado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar pet';
      showToast.error('Erro', errorMessage);
    }
  };

  if (loading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pet não encontrado</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container style={{ flex: 1 }}>
      <PetForm
        initialData={pet}
        onSubmit={handleSubmit}
        submitLabel="Salvar"
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 