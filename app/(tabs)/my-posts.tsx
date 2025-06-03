import { PostCardSkeleton } from '@/components/skeletons/PostCardSkeleton';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Header } from '@/components/ui/Header';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { PostCard } from '@components/PostCard';
import { useAuth } from '@hooks/useAuth';
import { postsService } from '@services/posts';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyPosts() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      if(user?.id) {
        const data = await postsService.getByUser(user?.id);
        setPosts(data);
        setShowSkeleton(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar posts';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <PostCardSkeleton key={index} showActions={true} />
    ));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Meus Posts" showAddButton addButtonLink="/post/create" />
        {renderSkeletons()}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Meus Posts" showAddButton addButtonLink="/post/create" />
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Meus Posts" 
        showAddButton 
        addButtonLink="/post/create"
      />
      <FlatList
        data={showSkeleton ? Array(3).fill({}) : posts}
        renderItem={({ index }) => 
          showSkeleton ? (
            <PostCardSkeleton />
          ) : (
            <PostCard
              {...posts[index]}
              showActions
              onEdit={() => handleEdit(posts[index].id)}
              onDelete={() => handleDelete(posts[index])}
            />
          )
        }
        keyExtractor={(_, index) => showSkeleton ? `skeleton-${index}` : `post-${index}`}
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
    </SafeAreaView>
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
}); 