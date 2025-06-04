import { UserWithToken } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@pet-finder:user';

export const getToken = async (): Promise<string | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    const user = JSON.parse(userJson) as UserWithToken;
    return user.token;
  } catch {
    return null;
  }
}; 