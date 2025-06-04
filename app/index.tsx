import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { useAuth } from '@hooks/useAuth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const initialize = async () => {
    try {
      setError(null);
      // Aqui você pode adicionar qualquer lógica de inicialização necessária
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao inicializar o aplicativo';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);
  
  if (loading || authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ListState 
          type="error" 
          message="Não foi possível inicializar o aplicativo. Tente novamente mais tarde."
          onRetry={() => {
            setLoading(true);
            initialize();
          }}
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
});
