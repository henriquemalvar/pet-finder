import { PetForm } from '@/components/PetForm';
import { PetImage } from '@/components/PetImage';
import { PetEditSkeleton } from '@/components/skeletons/PetEditSkeleton';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { Pet } from '@/types/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { petsService } from '@services/pets';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Editar Pet" />
        <PetEditSkeleton />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Editar Pet" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pet não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Editar Pet" />
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.imageWrapper}>
          <PetImage pet={pet} style={styles.image} />
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
    </SafeAreaView>
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
}); 