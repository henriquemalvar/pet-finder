import { showToast } from '@/components/ui/Toast';
import { notificationsService } from '@/services/notificationsService';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications(userId?: string) {
  useEffect(() => {
    if (!userId) return;

    async function register() {
      try {
        if (!Device.isDevice) {
          return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          showToast.error('Erro', 'Permissão de notificações negada');
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        if (!tokenData) {
          console.warn('Token de notificação não disponível');
          return;
        }
        const token = tokenData.data;
        await notificationsService.registerToken(token);

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }
      } catch (err) {
        console.warn('Erro ao registrar notificações', err);
      }
    }

    register();
  }, [userId]);
}
