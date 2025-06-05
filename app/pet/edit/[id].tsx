import { PetForm } from '@/components/PetForm';
import { Container } from '@/components/ui/Container';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { Pet } from '@/types/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const handleSubmit = async (data: Partial<Pet>) => {
    try {
      if (!id) return;
      await petsService.update(id, data);
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
    <Container>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.imageWrapper}>
          {pet.image ? (
            <Image source={{ uri: pet.image }} style={styles.image} />
          ) : (
            <Image 
              source={String(pet.type).toUpperCase() === 'DOG' 
                ? require('@assets/images/default-dog.png')
                : require('@assets/images/default-cat.png')
              } 
              style={styles.image} 
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="close" size={28} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.formWrapper}>
          <PetForm
            initialData={pet}
            onSubmit={handleSubmit}
            submitLabel="Salvar"
          />
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
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
  imageWrapper: {
    position: 'relative',
    backgroundColor: '#eee',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: -16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 