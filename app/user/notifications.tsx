import { MenuItem } from '@/components/ui/MenuItem';
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

          <MenuItem
            leftIcon="mail-outline"
            label="Notificações por E-mail"
            rightComponent={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            }
          />

          <MenuItem
            leftIcon="notifications-outline"
            label="Notificações Push"
            rightComponent={
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Notificação</Text>

          <MenuItem
            leftIcon="chatbubble-outline"
            label="Novas Mensagens"
            rightComponent={
              <Switch
                value={newMessages}
                onValueChange={setNewMessages}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            }
          />

          <MenuItem
            leftIcon="paw-outline"
            label="Novos Pets"
            rightComponent={
              <Switch
                value={newPets}
                onValueChange={setNewPets}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            }
          />

          <MenuItem
            leftIcon="refresh-outline"
            label="Atualizações do App"
            rightComponent={
              <Switch
                value={updates}
                onValueChange={setUpdates}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            }
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
}); 