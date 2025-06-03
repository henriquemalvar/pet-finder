import { User } from './database';

export type UserWithToken = User & {
  token: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}; 