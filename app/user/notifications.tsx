import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Container } from '@/components/ui/Container';

export default function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [newPets, setNewPets] = useState(true);
  const [updates, setUpdates] = useState(true);

  return (
    <Container edges={['top']}>
      <Header title="Notificações" showBackButton />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canais</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="mail-outline" size={24} color="#1a1a1a" />
              <Text style={styles.menuItemText}>Notificações por E-mail</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={24} color="#1a1a1a" />
              <Text style={styles.menuItemText}>Notificações Push</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Notificação</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-outline" size={24} color="#1a1a1a" />
              <Text style={styles.menuItemText}>Novas Mensagens</Text>
            </View>
            <Switch
              value={newMessages}
              onValueChange={setNewMessages}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="paw-outline" size={24} color="#1a1a1a" />
              <Text style={styles.menuItemText}>Novos Pets</Text>
            </View>
            <Switch
              value={newPets}
              onValueChange={setNewPets}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="refresh-outline" size={24} color="#1a1a1a" />
              <Text style={styles.menuItemText}>Atualizações do App</Text>
            </View>
            <Switch
              value={updates}
              onValueChange={setUpdates}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>
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
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
}); 