import { Pet } from '@/types/database';
import { useMemo } from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

interface PetImageProps extends Omit<ImageProps, 'source'> {
  pet?: Pet;
}

export function PetImage({ pet, style, ...props }: PetImageProps) {
  const defaultImage = require('@assets/images/default-dog.png');

  const imageSource = useMemo(() => {
    if (!pet) {
      return defaultImage;
    }

    const isDog = String(pet.type).toUpperCase() === 'DOG';
    const petImage = isDog
      ? require('@assets/images/default-dog.png')
      : require('@assets/images/default-cat.png');

    return pet.image ? { uri: pet.image } : petImage;
  }, [pet]);

  return (
    <Image
      source={imageSource}
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