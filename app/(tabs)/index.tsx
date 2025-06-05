import { Container } from '@/components/ui/Container';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { PostFilters, postsService } from '@/services/postsService';
import { Post } from '@/types/database';
import { PostCard } from '@components/PostCard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters?: string; title?: string }>();
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

  useEffect(() => {
    if (params.title) {
      router.setParams({ title: params.title });
    }
  }, [params.title, router]);

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

  const hasActiveFilters = Boolean(
    filters?.type || 
    filters?.petType || 
    filters?.petGender || 
    filters?.petSize || 
    filters?.search
  );

  if (error) {
    return (
      <Container>
        <ListState 
          type="error" 
          message={error}
          onRetry={() => loadPosts(1, filters)}
        />
      </Container>
    );
  }

  return (
    <Container>
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostCard post={item} onPress={() => router.push(`/post/${item.id}`)} />}
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

          <View style={styles.fabContainer}>
            {hasActiveFilters && (
              <TouchableOpacity 
                style={[styles.fab, styles.clearFab]} 
                onPress={handleClearFilters}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.fab, hasActiveFilters && styles.filterFab]} 
              onPress={handleFilterPress}
            >
              <Ionicons name="filter" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearFab: {
    backgroundColor: '#FF3B30',
  },
  filterFab: {
    backgroundColor: '#34C759',
  },
}); 