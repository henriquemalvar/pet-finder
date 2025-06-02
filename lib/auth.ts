import { showToast } from '@/components/ui/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@services/auth';

type UserWithToken = User & { token: string };

const USER_KEY = '@pet-finder:user';

export const getToken = async (): Promise<string | null> => {
  try {
    const user = await getUser();
    return user?.token || null;
  } catch (error) {
    showToast.error('Erro', 'Erro ao obter token');
    return null;
  }
};

export const getUser = async (): Promise<UserWithToken | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    showToast.error('Erro', 'Erro ao obter usuário');
    return null;
  }
};

export const saveUser = async (user: UserWithToken): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    showToast.error('Erro', 'Erro ao salvar usuário');
    throw error;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem('@token');
  } catch (error) {
    showToast.error('Erro', 'Erro ao remover usuário');
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getUser();
    return !!user;
  } catch (error) {
    showToast.error('Erro', 'Erro ao verificar autenticação');
    return false;
  }
}; 