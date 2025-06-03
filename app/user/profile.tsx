import { Container } from '@/components/ui/Container';
import { Header } from '@/components/ui/Header';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/user/edit-profile');
  };

  if (!user) {
    return (
      <Container edges={['top']}>
        <Header title="Perfil" />
        <View style={styles.centered}>
          <Text>Usuário não encontrado</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container edges={['top']}>
      <Header title="Perfil" />
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={user.avatar ? { uri: user.avatar } : require('@assets/images/default-dog.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditProfile}
          >
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/static/terms')}
          >
            <Ionicons name="document-text-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/static/help')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Ajuda</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.signOutButton]}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={[styles.menuText, styles.signOutText]}>
              {loading ? 'Saindo...' : 'Sair'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  menu: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 16,
  },
  signOutButton: {
    marginTop: 24,
    borderBottomWidth: 0,
  },
  signOutText: {
    color: '#FF3B30',
  },
}); 