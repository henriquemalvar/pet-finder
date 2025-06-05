export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum PetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT'
}

export enum PostType {
  LOST = 'LOST',
  FOUND = 'FOUND',
  ADOPTION = 'ADOPTION'
}

export enum PostStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  CANCELED = 'CANCELED'
}

export enum PetAge {
  PUPPY = 'PUPPY',
  YOUNG = 'YOUNG',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR'
}

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  whatsapp?: string;
  instagram?: string;
  contactPreference?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  password: string;
  pets: Pet[];
  posts: Post[];
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  whatsapp?: string;
  instagram?: string;
  contactPreference?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: PetGender;
  size: PetSize;
  image?: string;
  description: string;
  castrated: boolean;
  vaccinated: boolean;
  location: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  petId: string;
  pet: Pet;
  userId: string;
  user: User;
  type: PostType;
  location: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

export * from './auth';
export * from './pet';
export * from './post';
export * from './user';

