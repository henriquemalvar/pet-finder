import { Pet } from '@/types/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageHeaderProps {
  pet: Pet;
  onClose: () => void;
  badgeText: string;
  badgeIcon: keyof typeof MaterialCommunityIcons.glyphMap;
  badgeColor?: string;
}

export function ImageHeader({ pet, onClose, badgeText, badgeIcon, badgeColor = '#3CB371' }: ImageHeaderProps) {
  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialCommunityIcons name="close" size={28} color="#222" />
      </TouchableOpacity>
      <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
        <MaterialCommunityIcons name={badgeIcon} size={16} color="#fff" />
        <Text style={styles.typeBadgeText}>{badgeText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 36,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
  },
  typeBadge: {
    position: 'absolute',
    left: 20,
    top: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    elevation: 2,
  },
  typeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 