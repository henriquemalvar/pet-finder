import { PetGender, PetSize, PetType, PostType } from '@/types/database';

export const PET_TYPE_LABELS: Record<PetType, string> = {
  [PetType.DOG]: 'Cachorro',
  [PetType.CAT]: 'Gato',
};

export const PET_GENDER_LABELS: Record<PetGender, string> = {
  [PetGender.MALE]: 'Macho',
  [PetGender.FEMALE]: 'Fêmea',
};

export const PET_SIZE_LABELS: Record<PetSize, string> = {
  [PetSize.SMALL]: 'Pequeno',
  [PetSize.MEDIUM]: 'Médio',
  [PetSize.LARGE]: 'Grande',
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.ADOPTION]: 'Adoção',
  [PostType.LOST]: 'Perdido',
  [PostType.FOUND]: 'Encontrado',
};

export const getPetTypeLabel = (type: PetType): string => PET_TYPE_LABELS[type];
export const getPetGenderLabel = (gender: PetGender): string => PET_GENDER_LABELS[gender];
export const getPetSizeLabel = (size: PetSize): string => PET_SIZE_LABELS[size];
export const getPostTypeLabel = (type: PostType): string => POST_TYPE_LABELS[type]; 