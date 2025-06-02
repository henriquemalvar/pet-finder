import { PostCardSkeleton } from '@/components/skeletons/PostCardSkeleton';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { PostCard } from '@components/PostCard';
import { Post, postsService } from '@services/posts';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      setError(null);
      const data = await postsService.list();
      setPosts(data);
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
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <PostCardSkeleton key={index} />
    ));
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Posts" 
          showAddButton 
          addButtonLink="/post/create"
        />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Posts" 
        showAddButton 
        addButtonLink="/post/create"
      />
      {loading ? (
        <View style={styles.list}>
          {renderSkeletons()}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard {...item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
  },
}); 