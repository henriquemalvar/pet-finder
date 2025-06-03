import { Pet, PetType } from '@/types/database';
import { Image, ImageProps, StyleSheet } from 'react-native';

interface PetImageProps extends Omit<ImageProps, 'source'> {
  pet: Pet;
}

export function PetImage({ pet, style, ...props }: PetImageProps) {
  const defaultImage = pet.type === PetType.DOG 
    ? require('@assets/images/default-dog.png')
    : require('@assets/images/default-cat.png');

  return (
    <Image
      source={pet.image ? { uri: pet.image } : defaultImage}
      style={[styles.image, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
}); 