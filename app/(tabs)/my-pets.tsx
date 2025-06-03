import { PetCardSkeleton } from '@/components/skeletons/PetCardSkeleton';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Header } from '@/components/ui/Header';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { Pet } from '@/types/database';
import { PetCard } from '@components/PetCard';
import { useAuth } from '@hooks/useAuth';
import { petsService } from '@services/pets';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Container } from '@/components/ui/Container';

export default function MyPets() {
  const router = useRouter();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPets = useCallback(async () => {
    try {
      setError(null);
      if(user?.id) {
        const data = await petsService.getByUser(user?.id);
        setPets(data as unknown as Pet[]);
        setShowSkeleton(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar pets';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <PetCardSkeleton key={index} />
    ));
  };

  if (error) {
    return (
      <Container edges={['top']}>
        <Header 
          title="Meus Pets" 
          showAddButton 
          addButtonLink="/pet/create"
        />
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

  if (loading) {
    return (
      <Container edges={['top']}>
        <Header 
          title="Meus Pets" 
          showAddButton 
          addButtonLink="/pet/create"
        />
        {renderSkeletons()}
      </Container>
    );
  }

  return (
    <Container edges={['top']}>
      <Header 
        title="Meus Pets" 
        showAddButton 
        addButtonLink="/pet/create"
      />
      <FlatList
        data={showSkeleton ? Array(3).fill({}) : pets}
        renderItem={({ index }) => 
          showSkeleton ? (
            <PetCardSkeleton />
          ) : (
            <PetCard
              pet={pets[index]}
              showActions
              onEdit={handleEdit}
              onDelete={() => handleDelete(pets[index])}
            />
          )
        }
        keyExtractor={(_, index) => showSkeleton ? `skeleton-${index}` : `pet-${index}`}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
}); 