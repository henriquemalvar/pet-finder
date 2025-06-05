import { Container } from '@/components/ui/Container';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        setLoading(false);

        if (!authLoading) {
          if (!user) {
            router.replace('/auth/login');
          } else {
            router.replace('/(tabs)');
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao inicializar o aplicativo';
        setError(errorMessage);
        showToast.error('Erro', errorMessage);
        setLoading(false);
      }
    };

    initialize();
  }, [authLoading, user]);

  if (loading || authLoading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#007AFF" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ListState 
          type="error" 
          message="Não foi possível inicializar o aplicativo. Tente novamente mais tarde."
          onRetry={() => {
            setLoading(true);
            setError(null);
          }}
        />
      </Container>
    );
  }

  return null;
}
