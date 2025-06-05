import { UserWithToken } from '@/types/database';
import { StyleSheet, Text, View } from 'react-native';

interface UserCardProps {
  user: UserWithToken | null;
  size?: 'small' | 'medium' | 'large';
  showEmail?: boolean;
  style?: any;
}

export function UserCard({ user, size = 'medium', showEmail = true, style }: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 120;
      default:
        return 80;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return { name: 14, email: 12 };
      case 'large':
        return { name: 24, email: 16 };
      default:
        return { name: 18, email: 14 };
    }
  };

  const avatarSize = getAvatarSize();
  const fontSize = getFontSize();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
        <Text style={[styles.avatarText, { fontSize: avatarSize * 0.4 }]}>
          {getInitials(user?.name || 'User')}
        </Text>
      </View>

      <Text style={[styles.name, { fontSize: fontSize.name }]}>
        {user?.name || 'Usuário'}
      </Text>
      
      {showEmail && (
        <Text style={[styles.email, { fontSize: fontSize.email }]}>
          {user?.email || 'usuario@email.com'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
}); 