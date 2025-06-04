import { User } from './user';

export interface UserWithToken extends Omit<User, 'password'> {
  token: string;
}

export interface AuthResponse {
  user: UserWithToken;
  token: string;
}