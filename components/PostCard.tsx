import { Post } from '@/types/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (post: Post) => void;
}

export function PostCard({ post, onPress, showActions, onEdit, onDelete }: PostCardProps) {
  if (!post || !post.pet) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {post.pet.image ? (
        <Image source={{ uri: post.pet.image }} style={styles.image} />
      ) : (
        <Image 
          source={String(post.pet.type).toUpperCase() === 'DOG' 
            ? require('@assets/images/default-dog.png')
            : require('@assets/images/default-cat.png')
          } 
          style={styles.image} 
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {post.content}
        </Text>
        <View style={styles.metadata}>
          <Text style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.author}>{post.user?.name || 'Usuário'}</Text>
        </View>
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => onEdit?.(post.id)}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => onDelete?.(post)}
            >
              <MaterialCommunityIcons name="delete" size={16} color="#fff" />
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
    overflow: 'hidden',
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  author: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
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