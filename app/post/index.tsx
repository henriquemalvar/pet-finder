import { ListSkeleton } from '@/components/skeletons/ListSkeleton';
import { Header } from '@/components/ui/Header';
import { PetImage } from '@/components/PetImage';
import { Post } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { postsService } from '@services/posts';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      setError(null);
      const data = await postsService.list();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setError('Não foi possível carregar a lista de posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handlePostPress = (id: string) => {
    router.push(`/post/${id}`);
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(item.id)}
    >
      <PetImage pet={item.pet} style={styles.postImage} />
      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{item.pet.name}</Text>
        <Text style={styles.postDescription} numberOfLines={2}>
          {item.pet.description}
        </Text>
        <View style={styles.postMetadata}>
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.postAuthor}>{item.user.name}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Posts" />
        <ListSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Posts" />
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>Nenhum post encontrado</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  list: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postInfo: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  postMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postAuthor: {
    fontSize: 12,
    color: '#666',
  },
}); 