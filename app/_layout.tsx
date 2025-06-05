import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { lightTheme } from '@/theme';
import Toast, { toastConfig } from '@components/ui/Toast';
import { ThemeProvider } from '@contexts/ThemeContext';
import { useAuth } from '@hooks/useAuth';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

interface PetParams {
  id: string;
  name?: string;
}

interface PostParams {
  id: string;
  title?: string;
}

export default function RootLayout() {
  const { user } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <PaperProvider theme={lightTheme}>
          <ThemeProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              
              <Stack.Screen name="static/help" options={{ headerShown: true, headerTitle: 'Ajuda', headerBackTitle: 'Voltar' }} />
              <Stack.Screen name="static/terms" options={{ headerShown: true, headerTitle: 'Termos de Uso', headerBackTitle: 'Voltar' }} />
              
              <Stack.Screen name="user/change-password" options={{ headerShown: true, headerTitle: 'Alterar Senha', headerBackTitle: 'Voltar' }} />
              <Stack.Screen name="user/edit-profile" options={{ headerShown: true, headerTitle: 'Editar Perfil', headerBackTitle: 'Voltar' }} />
              <Stack.Screen name="user/notifications" options={{ headerShown: true, headerTitle: 'Notificações', headerBackTitle: 'Voltar' }} />

              <Stack.Screen name="post/index" options={{ headerShown: true, headerTitle: 'Posts' }} />
              <Stack.Screen 
                name="post/[id]" 
                options={({ route }) => ({
                  headerShown: true,
                  headerTitle: (route.params as PostParams)?.title || 'Post',
                  headerBackTitle: 'Voltar'
                })} 
              />
              <Stack.Screen name='post/create' options={{ headerShown: true, headerTitle: 'Criar Post' }} />
              <Stack.Screen name='post/edit/[id]' options={{ headerShown: true, headerTitle: 'Editar Post' }} />
              
              <Stack.Screen name="pet/index" options={{ headerShown: true, headerTitle: 'Pets' }} />
              <Stack.Screen 
                name="pet/[id]" 
                options={({ route }) => ({
                  headerShown: true,
                  headerTitle: (route.params as PetParams)?.name || 'Pet',
                  headerBackTitle: 'Voltar'
                })} 
              />
              <Stack.Screen name="pet/create" options={{ headerShown: true, headerTitle: 'Criar Pet' }} />
              <Stack.Screen name="pet/edit/[id]" options={{ headerShown: true, headerTitle: 'Editar Pet' }} />

              <Stack.Screen name="search" options={{ headerShown: true, headerTitle: 'Pesquisar' }} />
              <Stack.Screen name='notifications' options={{ headerShown: true, headerTitle: 'Notificações' }} />
            </Stack>
            <Toast config={toastConfig} />
          </ThemeProvider>
        </PaperProvider>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}
