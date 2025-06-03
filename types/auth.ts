import { User } from './database';

export interface UserWithToken extends Omit<User, 'password'> {
  token: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthResponse {
  user: UserWithToken;
  token: string;
} 