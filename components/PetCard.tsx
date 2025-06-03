import { Pet } from '@/types/database';
import { getPetGenderLabel, getPetSizeLabel, getPetTypeLabel } from '@/utils/pet';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetCardProps {
  pet: Pet;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PetCard({ pet, showActions = false, onEdit, onDelete }: PetCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => router.push(`/pet/${pet.id}`)}
    >
      <Image
        source={pet.image ? { uri: pet.image } : require('@assets/images/default-dog.png')}
        style={styles.petImage}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getPetTypeLabel(pet.type as 'DOG' | 'CAT')}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getPetGenderLabel(pet.gender)}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.details}>
          {pet.age} • {getPetSizeLabel(pet.size)}
        </Text>
        <Text style={styles.location}>{pet.location}</Text>
        <View style={styles.status}>
          {pet.castrated && (
            <View style={styles.statusItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.statusText}>Castrado</Text>
            </View>
          )}
          {pet.vaccinated && (
            <View style={styles.statusItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.statusText}>Vacinado</Text>
            </View>
          )}
        </View>
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit?.(pet.id)}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete?.(pet.id)}
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
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
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
  petImage: {
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
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  status: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
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