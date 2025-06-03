import { PetGender, PetSize } from '@/types/database';
import { PetType, PostType } from './pet';

export type FilterOption<T> = {
  label: string;
  value: T;
  icon: string;
};

export const typeOptions: FilterOption<PostType>[] = [
  { label: 'Perdido', value: 'LOST', icon: 'search' },
  { label: 'Encontrado', value: 'FOUND', icon: 'checkmark-circle' },
  { label: 'Adoção', value: 'ADOPTION', icon: 'heart' },
] as const;

export const petTypeOptions: FilterOption<PetType>[] = [
  { label: 'Cachorro', value: 'DOG', icon: 'paw' },
  { label: 'Gato', value: 'CAT', icon: 'paw' },
] as const;

export type AgeValue = 'PUPPY' | 'YOUNG' | 'ADULT' | 'SENIOR';

export const ageOptions: FilterOption<AgeValue>[] = [
  { label: 'Filhote', value: 'PUPPY', icon: 'heart' },
  { label: 'Jovem', value: 'YOUNG', icon: 'leaf' },
  { label: 'Adulto', value: 'ADULT', icon: 'person' },
  { label: 'Idoso', value: 'SENIOR', icon: 'time' },
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