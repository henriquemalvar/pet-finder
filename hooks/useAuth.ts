import { showToast } from '@/components/ui/Toast';
import { authService, getUser, removeUser, saveUser } from '@/services/authService';
import { UserWithToken } from '@/types/auth';
import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback(async (token: string) => {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      return Date.now() < expirationTime;
    } catch {
      return false;
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

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await getUser();
      
      if (storedUser) {
        const isTokenValid = await validateToken(storedUser.token);
        
        if (!isTokenValid) {
          await logout();
          showToast.error('Sessão expirada', 'Por favor, faça login novamente');
          return;
        }
        
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      showToast.error('Erro', 'Erro ao carregar usuário');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [validateToken, logout]);

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

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast.success('Sucesso', 'Senha alterada com sucesso');
    } catch (error) {
      showToast.error('Erro', 'Erro ao alterar senha');
      throw error;
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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