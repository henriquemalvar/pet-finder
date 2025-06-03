import { PetGender, PetSize } from '@/types/database';

export type PetType = 'DOG' | 'CAT';
export type PostType = 'ADOPTION' | 'LOST' | 'FOUND';

export const PET_TYPE_LABELS: Record<PetType, string> = {
  DOG: 'Cachorro',
  CAT: 'Gato',
};

export const PET_GENDER_LABELS: Record<PetGender, string> = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
};

export const PET_SIZE_LABELS: Record<PetSize, string> = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  ADOPTION: 'Adoção',
  LOST: 'Perdido',
  FOUND: 'Encontrado',
};

export const getPetTypeLabel = (type: PetType): string => PET_TYPE_LABELS[type];
export const getPetGenderLabel = (gender: PetGender): string => PET_GENDER_LABELS[gender];
export const getPetSizeLabel = (size: PetSize): string => PET_SIZE_LABELS[size];
export const getPostTypeLabel = (type: PostType): string => POST_TYPE_LABELS[type]; 