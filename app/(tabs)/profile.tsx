import { MenuItem } from '@/components/ui/MenuItem';
import { useAuth } from '@hooks/useAuth';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para gerar as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(user?.name || 'User')}
            </Text>
          </View>

          <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>

            <MenuItem
              leftIcon="person-outline"
              label="Editar Perfil"
              onPress={() => router.push('/user/edit-profile')}
              rightIcon="chevron-forward"
            />

            <MenuItem
              leftIcon="notifications-outline"
              label="Notificações"
              onPress={() => router.push('/user/notifications')}
              rightIcon="chevron-forward"
            />

            <MenuItem
              leftIcon="lock-closed-outline"
              label="Alterar Senha"
              onPress={() => router.push('/user/change-password' as any)}
              rightIcon="chevron-forward"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>

            <MenuItem
              leftIcon="help-circle-outline"
              label="Ajuda"
              onPress={() => router.push('/static/help')}
              rightIcon="chevron-forward"
            />

            <MenuItem
              leftIcon="information-circle-outline"
              label="Termos de Uso"
              onPress={() => router.push('/static/terms')}
              rightIcon="chevron-forward"
            />
          </View>

          <MenuItem
            leftIcon="log-out-outline"
            label="Sair"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonText}
            leftIconColor="#FF3B30"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
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
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 