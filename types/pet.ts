import { BaseEntity, Location } from './base';
import { Post } from './post';

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

export enum PetAge {
  PUPPY = 'PUPPY',
  YOUNG = 'YOUNG',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR'
}

export interface Pet extends BaseEntity, Location {
  name: string;
  type: PetType;
  breed: string;
  age: PetAge;
  gender: PetGender;
  size: PetSize;
  image?: string;
  description: string;
  castrated: boolean;
  vaccinated: boolean;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  posts: Post[];
} 