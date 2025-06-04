import { BaseEntity, Location } from './base';
import { Pet } from './pet';

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

export interface Post extends BaseEntity, Location {
  title: string;
  content: string;
  petId: string;
  pet: Pet;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  type: PostType;
  status: PostStatus;
} 