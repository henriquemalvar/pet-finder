import { Container } from '@/components/ui/Container';
import { ListState } from '@/components/ui/ListState';
import { showToast } from '@/components/ui/Toast';
import { useAuth } from '@hooks/useAuth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const initialize = async () => {
    try {
      setError(null);
      // Aqui você pode adicionar qualquer lógica de inicialização necessária
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao inicializar o aplicativo';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);
  
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
            initialize();
          }}
        />
      </Container>
    );
  }
  
  return <Redirect href={user ? "/(tabs)" : "/auth"} />;
} 