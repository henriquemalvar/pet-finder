import { showToast } from '@/components/ui/Toast';
import { UserWithToken } from '@/types/auth';
import { authService, getUser, removeUser, saveUser } from '@/services/authService';
import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await getUser();
      
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      showToast.error('Erro', 'Erro ao carregar usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const userData = await authService.login({ email, password });
      await saveUser(userData);
      setUser(userData);
      return userData;
    } catch (error) {
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