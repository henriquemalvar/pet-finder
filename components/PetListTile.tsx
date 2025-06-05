import { Pet } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetListTileProps {
  pet: Pet;
  onPress?: () => void;
  selected?: boolean;
  disableNavigation?: boolean;
  showActions?: boolean;
}

export function PetListTile({ pet, onPress, selected, disableNavigation, showActions }: PetListTileProps) {
  const formatAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
      (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`;
    }
    
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    
    if (months === 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  };

  const formatGender = (gender: string) => {
    return gender === 'MALE' ? 'Macho' : 'Fêmea';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        selected && styles.containerSelected
      ]} 
      onPress={onPress}
    >
      {pet.image ? (
        <Image source={{ uri: pet.image }} style={styles.image} />
      ) : (
        <Image 
          source={String(pet.type).toUpperCase() === 'DOG' 
            ? require('@assets/images/default-dog.png')
            : require('@assets/images/default-cat.png')
          } 
          style={styles.image} 
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          {selected && (
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          )}
        </View>
        <Text style={styles.breed}>{pet.breed}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{`${pet.age} ano${Number(pet.age) > 1 ? 's' : ''}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="male-female-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{formatGender(pet.gender)}</Text>
          </View>
          {pet.location && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                {pet.location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  containerSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  breed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
}); 