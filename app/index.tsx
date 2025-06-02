import { PostCardSkeleton } from '@/components/skeletons/PostCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { showToast } from '@/components/ui/Toast';
import { useAuth } from '@hooks/useAuth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        // Aqui você pode adicionar qualquer lógica de inicialização necessária
        setShowSkeleton(false);
        setLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao inicializar o aplicativo';
        setError(errorMessage);
        showToast.error('Erro', errorMessage);
        setShowSkeleton(false);
        setLoading(false);
      }
    };

    initialize();
  }, []);
  
  if (loading || authLoading || showSkeleton) {
    return (
      <View style={styles.container}>
        {showSkeleton ? (
          <View style={styles.skeletonContainer}>
            {[...Array(3)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <ActivityIndicator size="large" color="#007AFF" />
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <EmptyState 
          type="error" 
          message="Não foi possível inicializar o aplicativo. Tente novamente mais tarde."
        />
      </View>
    );
  }
  
  return <Redirect href={user ? "/(tabs)" : "/auth"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  skeletonContainer: {
    width: '100%',
    padding: 16,
    gap: 16,
  },
}); 