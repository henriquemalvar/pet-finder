import { Container } from '@/components/ui/Container';
import { Header } from '@/components/ui/Header';
import { MenuItem } from '@/components/ui/MenuItem';
import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

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
          <MenuItem
            leftIcon="person-outline"
            label="Editar Perfil"
            onPress={handleEditProfile}
            rightIcon="chevron-forward"
          />

          <MenuItem
            leftIcon="document-text-outline"
            label="Termos de Uso"
            onPress={() => router.push('/static/terms')}
            rightIcon="chevron-forward"
          />

          <MenuItem
            leftIcon="help-circle-outline"
            label="Ajuda"
            onPress={() => router.push('/static/help')}
            rightIcon="chevron-forward"
          />

          <MenuItem
            leftIcon="log-out-outline"
            label={loading ? 'Saindo...' : 'Sair'}
            onPress={handleSignOut}
            style={styles.signOutButton}
            labelStyle={styles.signOutText}
            leftIconColor="#FF3B30"
          />
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