import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="paw" size={64} color="#007AFF" />
        <Text style={styles.title}>Ops!</Text>
        <Text style={styles.subtitle}>Página não encontrada</Text>
        <Text style={styles.description}>
          Parece que você se perdeu. Não se preocupe, vamos te ajudar a encontrar
          o caminho de volta.
        </Text>

        <Link href="/auth" asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={styles.buttonText}>Voltar para o Início</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 