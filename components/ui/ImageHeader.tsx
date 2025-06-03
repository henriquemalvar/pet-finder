import { PetImage } from '@/components/PetImage';
import { Pet } from '@/types/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageHeaderProps {
  pet: Pet;
  onClose: () => void;
  badgeText: string;
  badgeIcon: string;
  badgeColor?: string;
}

export const ImageHeader: React.FC<ImageHeaderProps> = ({
  pet,
  onClose,
  badgeText,
  badgeIcon,
  badgeColor = '#3CB371',
}) => {
  return (
    <View style={styles.imageWrapper}>
      <PetImage pet={pet} />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialCommunityIcons name="close" size={28} color="#222" />
      </TouchableOpacity>
      <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}> 
        <MaterialCommunityIcons name={badgeIcon} size={16} color="#fff" />
        <Text style={styles.typeBadgeText}>{badgeText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
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