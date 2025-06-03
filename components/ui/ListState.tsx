import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ListStateProps = {
  type: 'empty' | 'error';
  message: string;
  onRetry?: () => void;
};

export function ListState({ type, message, onRetry }: ListStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={type === 'empty' ? 'list' : 'alert-circle'}
        size={48}
        color={type === 'empty' ? '#666' : '#FF3B30'}
      />
      <Text style={[styles.message, type === 'error' && styles.errorMessage]}>
        {message}
      </Text>
      {type === 'error' && onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#FF3B30',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 