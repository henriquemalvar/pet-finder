import { useAuth } from '@hooks/useAuth';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: 'found' | 'lost' | 'adoption';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationData {
  id: string;
  type: 'found' | 'lost' | 'adoption';
  title: string;
  body: string;
}

interface NotificationsContextData {
  notifications: Notification[];
  hasUnreadNotifications: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  handleNotificationPress: (notification: Notification) => void;
}

const NotificationsContext = createContext<NotificationsContextData>({} as NotificationsContextData);

// Dados mockados para exemplo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'found',
    title: 'Pet encontrado!',
    message: 'Um cachorro da raça Golden Retriever foi encontrado próximo ao Parque Central',
    time: '5 min atrás',
    read: false,
  },
  {
    id: '2',
    type: 'lost',
    title: 'Alerta de pet perdido',
    message: 'Um gato siamês foi reportado como perdido na Rua das Flores',
    time: '1 hora atrás',
    read: false,
  },
  {
    id: '3',
    type: 'adoption',
    title: 'Novo pet para adoção',
    message: 'Um filhote de Labrador está disponível para adoção responsável',
    time: '2 horas atrás',
    read: true,
  },
  {
    id: '4',
    type: 'found',
    title: 'Pet encontrado!',
    message: 'Um gato preto foi encontrado no bairro Jardim América',
    time: '3 horas atrás',
    read: true,
  },
  {
    id: '5',
    type: 'adoption',
    title: 'Novo pet para adoção',
    message: 'Uma gatinha de 2 meses está procurando um lar amoroso',
    time: '5 horas atrás',
    read: true,
  }
];

// Função para validar os dados da notificação
function isValidNotificationData(data: unknown): data is NotificationData {
  if (!data || typeof data !== 'object') return false;
  
  const notification = data as NotificationData;
  return (
    typeof notification.id === 'string' &&
    ['found', 'lost', 'adoption'].includes(notification.type) &&
    typeof notification.title === 'string' &&
    typeof notification.body === 'string'
  );
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { user } = useAuth();

  const hasUnreadNotifications = notifications.some(notification => !notification.read);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleNotificationPress = useCallback((notification: Notification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'found':
        router.push('/pet/found');
        break;
      case 'lost':
        router.push('/pet/lost');
        break;
      case 'adoption':
        router.push('/pet/adoption');
        break;
    }
  }, [markAsRead]);

  // Configurar listener para notificações recebidas
  useEffect(() => {
    if (!user) return;

    // Listener para notificações recebidas quando o app está em foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      
      if (isValidNotificationData(data)) {
        // Adicionar nova notificação à lista
        setNotifications(prev => [{
          id: data.id,
          type: data.type,
          title: data.title,
          message: data.body,
          time: 'Agora',
          read: false
        }, ...prev]);
      }
    });

    // Listener para quando o usuário interage com a notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (isValidNotificationData(data)) {
        // Marcar como lida e navegar
        markAsRead(data.id);
        
        switch (data.type) {
          case 'found':
            router.push('/pet/found');
            break;
          case 'lost':
            router.push('/pet/lost');
            break;
          case 'adoption':
            router.push('/pet/adoption');
            break;
        }
      }
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, [user, markAsRead]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        hasUnreadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        handleNotificationPress,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationsProvider');
  }

  return context;
} 