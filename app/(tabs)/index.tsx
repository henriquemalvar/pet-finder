import { PostCardSkeleton } from '@/components/skeletons/PostCardSkeleton';
import { Header } from '@/components/ui/Header';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { Post } from '@/types/database';
import { PostCard } from '@components/PostCard';
import { PostFilters, postsService } from '@services/posts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters?: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<PostFilters | undefined>(undefined);

  useEffect(() => {
    if (params.filters) {
      try {
        const parsedFilters = JSON.parse(params.filters) as PostFilters;
        setFilters(parsedFilters);
        loadPosts(1, parsedFilters);
      } catch (error) {
        showToast.error('Erro', 'Filtros inválidos');
      }
    } else {
      loadPosts(1);
    }
  }, [params.filters]);

  const loadPosts = async (pageNumber = 1, currentFilters?: PostFilters) => {
    try {
      setError(null);
      const data = await postsService.list({
        ...currentFilters,
        page: pageNumber,
      });
      
      if (pageNumber === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao carregar posts. Tente novamente.';
      
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts(1, filters);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1, filters);
    }
  };

  const handleFilterPress = () => {
    router.push('/search');
  };

  const handleClearFilters = () => {
    setFilters(undefined);
    loadPosts(1);
    router.setParams({});
  };

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <PostCardSkeleton key={index} />
    ));
  };

  const hasActiveFilters = Boolean(
    filters?.type || 
    filters?.petType || 
    filters?.petGender || 
    filters?.petSize || 
    filters?.search
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Posts" 
          showAddButton 
          showFilterButton
          onFilterPress={handleFilterPress}
          addButtonLink="/post/create"
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
        <ListState 
          type="error" 
          message={error}
          onRetry={() => loadPosts(1, filters)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Posts" 
        showAddButton 
        showFilterButton
        onFilterPress={handleFilterPress}
        addButtonLink="/post/create"
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />
      {loading && !refreshing ? (
        <View style={styles.list}>
          {renderSkeletons()}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard {...item} />}
          contentContainerStyle={[
            styles.list,
            !posts.length && styles.emptyList
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={
            !loading && posts.length === 0 ? (
              <ListState 
                type="empty" 
                message="Não há posts disponíveis no momento."
              />
            ) : null
          }
        />
      )}
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
  },
  emptyList: {
    flexGrow: 1,
  },
}); 