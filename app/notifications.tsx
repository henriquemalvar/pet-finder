import { Container } from '@/components/ui/Container';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface Notification {
  id: string;
  type: 'found' | 'lost' | 'adoption';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const getNotificationIcon = (type: 'found' | 'lost' | 'adoption') => {
  switch (type) {
    case 'found':
      return 'checkmark-circle';
    case 'lost':
      return 'alert-circle';
    case 'adoption':
      return 'paw';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type: 'found' | 'lost' | 'adoption') => {
  switch (type) {
    case 'found':
      return '#34C759';
    case 'lost':
      return '#FF3B30';
    case 'adoption':
      return '#007AFF';
    default:
      return '#8E8E93';
  }
};

const RightActions = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onDelete}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export default function Notifications() {
  const {
    notifications,
    markAllAsRead,
    clearAllNotifications,
    deleteNotification,
    handleNotificationPress,
  } = useNotifications();

  const renderNotification = ({ item }: { item: Notification }) => (
    <Swipeable
      renderRightActions={() => (
        <RightActions onDelete={() => deleteNotification(item.id)} />
      )}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) }]}>
          <Ionicons name={getNotificationIcon(item.type)} size={24} color="#fff" />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <Container>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={markAllAsRead}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Marcar todas como lidas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearAllNotifications}
          style={styles.headerButton}
        >
          <Text style={[styles.headerButtonText, styles.clearAllText]}>Limpar todas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={48} color="#8E8E93" />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  clearAllText: {
    color: '#FF3B30',
  },
  list: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: '#F2F9FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
