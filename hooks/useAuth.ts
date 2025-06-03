import { showToast } from '@/components/ui/Toast';
import { getUser, removeUser, saveUser } from '@lib/auth';
import { authService, User } from '@services/auth';
import { useCallback, useEffect, useState } from 'react';

type UserWithToken = User & { token: string };

export function useAuth() {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = useCallback(async () => {
    try {
      console.log('Carregando usuário do AsyncStorage...');
      const storedUser = await getUser();
      console.log('Usuário carregado:', storedUser);
      
      if (storedUser) {
        setUser(storedUser as UserWithToken);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      showToast.error('Erro', 'Erro ao carregar usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Iniciando login...');
      const userData = await authService.login({ email, password });
      console.log('Dados do usuário recebidos:', userData);
      
      await saveUser(userData);
      console.log('Usuário salvo no AsyncStorage');
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Erro no login:', error);
      showToast.error('Erro', 'Erro no login');
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const userData = await authService.register({ name, email, password });
      await saveUser(userData);
      setUser(userData);
      return userData;
    } catch (error) {
      showToast.error('Erro', 'Erro no registro');
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeUser();
      setUser(null);
    } catch (error) {
      showToast.error('Erro', 'Erro no logout');
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast.success('Sucesso', 'Senha alterada com sucesso');
    } catch (error) {
      showToast.error('Erro', 'Erro ao alterar senha');
      throw error;
    }
  }, []);

  return {
    user,
    loading,
    loadUser,
    login,
    register,
    logout,
    changePassword,
  };
} 