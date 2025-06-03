import { lightTheme } from '@/theme';
import Toast, { toastConfig } from '@components/ui/Toast';
import { ThemeProvider } from '@contexts/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={lightTheme}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          
          <Stack.Screen name="static/help" options={{ headerShown: false }} />
          <Stack.Screen name="static/terms" options={{ headerShown: false }} />
          
          <Stack.Screen name="user/profile" options={{ headerShown: false }} />
          <Stack.Screen name="user/change-password" options={{ headerShown: false }} />
          <Stack.Screen name="user/edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="user/notifications" options={{ headerShown: false }} />

          <Stack.Screen name="post/index" options={{ headerShown: false }} />
          <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
          <Stack.Screen name='post/create' options={{ headerShown: false }} />
          <Stack.Screen name='post/edit/[id]' options={{ headerShown: false }} />
          
          <Stack.Screen name="pet/index" options={{ headerShown: false }} />
          <Stack.Screen name="pet/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="pet/create" options={{ headerShown: false }} />
          <Stack.Screen name="pet/edit/[id]" options={{ headerShown: false }} />

          <Stack.Screen name="search" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} />
      </ThemeProvider>
    </PaperProvider>
  );
}
