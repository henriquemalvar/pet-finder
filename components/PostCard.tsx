import { PetImage } from '@/components/PetImage';
import { PetType, Post } from '@/types/database';
import { getPetTypeLabel } from '@/utils/pet';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostCardProps extends Post {
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PostCard({ showActions = false, onEdit, onDelete, ...props }: PostCardProps) {
  const handlePress = () => {
    router.push({
      pathname: '/post/[id]' as const,
      params: { id: props.id, title: props.title }
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type: Post['type']) => {
    const options = {
      'ADOPTION': 'Adoção',
      'LOST': 'Perdido',
      'FOUND': 'Encontrado',
    }
    return options[type];
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <PetImage pet={props.pet} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{props.pet.name}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getPetTypeLabel(props.pet.type as PetType)}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getTypeLabel(props.type)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.breed}>{props.pet.breed}</Text>
        <Text style={styles.location}>{props.location}</Text>
        <Text style={styles.date}>Publicado em {formatDate(props.createdAt)}</Text>
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit?.(props.id)}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete?.(props.id)}
            >
              <Ionicons name="trash" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  breed: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 