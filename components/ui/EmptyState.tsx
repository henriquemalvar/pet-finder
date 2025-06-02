import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  type: 'error' | 'empty';
  message: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons 
        name={type === 'error' ? 'alert-circle' : 'information-circle'} 
        size={48} 
        color={type === 'error' ? '#FF6B6B' : '#666'} 
        style={styles.icon}
      />
      <Text style={[
        styles.text,
        type === 'error' && styles.errorText
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    color: '#FF6B6B',
  },
}); 