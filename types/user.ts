import { BaseEntity, Contact, Location } from './base';

export interface User extends BaseEntity, Contact, Location {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  pets: Array<{
    id: string;
    name: string;
    type: string;
    breed: string;
    image?: string;
  }>;
  posts: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
  }>;
}

export interface UpdateUserDTO extends Partial<Contact>, Partial<Location> {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
} 