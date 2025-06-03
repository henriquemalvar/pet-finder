import { PetAge, PetGender, PetSize, PetType, PostType } from '@/types/database';

export type FilterOption<T> = {
  label: string;
  value: T;
  icon: string;
};

export const typeOptions: FilterOption<PostType>[] = [
  { label: 'Perdido', value: PostType.LOST, icon: 'search' },
  { label: 'Encontrado', value: PostType.FOUND, icon: 'checkmark-circle' },
  { label: 'Adoção', value: PostType.ADOPTION, icon: 'heart' },
] as const;

export const petTypeOptions: FilterOption<PetType>[] = [
  { label: 'Cachorro', value: PetType.DOG, icon: 'paw' },
  { label: 'Gato', value: PetType.CAT, icon: 'paw' },
] as const;

export const ageOptions: FilterOption<PetAge>[] = [
  { label: 'Filhote', value: PetAge.PUPPY, icon: 'heart' },
  { label: 'Jovem', value: PetAge.YOUNG, icon: 'leaf' },
  { label: 'Adulto', value: PetAge.ADULT, icon: 'person' },
  { label: 'Idoso', value: PetAge.SENIOR, icon: 'time' },
] as const;

export const sizeOptions: FilterOption<PetSize>[] = [
  { label: 'Pequeno', value: PetSize.SMALL, icon: 'resize' },
  { label: 'Médio', value: PetSize.MEDIUM, icon: 'resize' },
  { label: 'Grande', value: PetSize.LARGE, icon: 'resize' },
] as const;

export const genderOptions: FilterOption<PetGender>[] = [
  { label: 'Macho', value: PetGender.MALE, icon: 'male' },
  { label: 'Fêmea', value: PetGender.FEMALE, icon: 'female' },
] as const;

export type PostTypeValue = typeof typeOptions[number]['value'];
export type PetTypeValue = typeof petTypeOptions[number]['value'];