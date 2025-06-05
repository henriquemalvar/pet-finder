import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Container } from '@/components/ui/Container';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { Pet } from '@/types/database';
import { PetCard } from '@components/PetCard';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

export default function MyPets() {
  const router = useRouter();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityIndicatorVisible, setActivityIndicatorVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPets = useCallback(async () => {
    try {
      setActivityIndicatorVisible(true);
      setError(null);
      if(user?.id) {
        const data = await petsService.getByUser(user?.id);
        setPets(data as unknown as Pet[]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar pets';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setActivityIndicatorVisible(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPets();
  };

  const handleEdit = (id: string) => {
    router.push(`/pet/edit/${id}`);
  };

  const handleDelete = (pet: Pet) => {
    setPetToDelete(pet);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;

    try {
      setDeleting(true);
      await petsService.delete(petToDelete.id);
      showToast.success('Sucesso', 'Pet removido com sucesso');
      await loadPets();
      setDeleteModalVisible(false);
      setPetToDelete(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar pet';
      showToast.error('Erro', errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <Container>
        <FlatList
          data={[]}
          renderItem={() => null}
          contentContainerStyle={styles.centered}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <ListState 
              type="error" 
              message="Não foi possível carregar seus pets. Tente novamente mais tarde."
              onRetry={loadPets}
            />
          }
        />
      </Container>
    );
  }

  if (loading || activityIndicatorVisible) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={pets}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            showActions
            onEdit={handleEdit}
            onDelete={() => handleDelete(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          (!pets.length || loading) && styles.emptyList
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !loading && pets.length === 0 ? (
            <ListState 
              type="empty" 
              message="Você ainda não tem pets cadastrados. Clique no botão + para adicionar um novo pet."
            />
          ) : null
        }
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setPetToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Pet"
        message={`Tem certeza que deseja excluir o pet "${petToDelete?.name}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 