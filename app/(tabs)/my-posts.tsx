import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Container } from '@/components/ui/Container';
import { FAB } from '@/components/ui/FAB';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { postsService } from '@/services/postsService';
import { PostCard } from '@components/PostCard';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

export default function MyPosts() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityIndicatorVisible, setActivityIndicatorVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      setActivityIndicatorVisible(true);
      if(user?.id) {
        const data = await postsService.getByUser(user?.id);
        setPosts(data);
        setActivityIndicatorVisible(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar posts';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
      setActivityIndicatorVisible(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setActivityIndicatorVisible(false);
    }
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleEdit = (id: string) => {
    router.push(`/post/edit/${id}`);
  };

  const handleDelete = (post: any) => {
    setPostToDelete(post);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      setDeleting(true);
      await postsService.delete(postToDelete.id);
      showToast.success('Sucesso', 'Post removido com sucesso');
      await loadPosts();
      setDeleteModalVisible(false);
      setPostToDelete(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar post';
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
              message="Não foi possível carregar seus posts. Tente novamente mais tarde."
              onRetry={loadPosts}
            />
          }
        />
        <FAB onPress={() => router.push('/post/new')} />
      </Container>
    );
  }

  return (
    <Container>
      {loading || activityIndicatorVisible ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              showActions
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            (!posts.length || loading) && styles.emptyList
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            !loading && posts.length === 0 ? (
              <ListState 
                type="empty" 
                message="Você ainda não tem posts. Clique no botão + para criar um novo post."
              />
            ) : null
          }
        />
      )}

      <FAB onPress={() => router.push('/post/new')} />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Post"
        message={`Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.`}
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