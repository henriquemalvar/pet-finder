import { Pet } from '@/types/database';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetListTileProps {
  pet: Pet;
  onPress?: () => void;
  selected?: boolean;
  disableNavigation?: boolean;
  showActions?: boolean;
}

export function PetListTile({ pet, onPress, selected, disableNavigation, showActions }: PetListTileProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  breed: {
    fontSize: 14,
    color: '#666',
  },
}); 