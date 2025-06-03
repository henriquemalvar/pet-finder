import { Container } from '@/components/ui/Container';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { usersService } from '@/services/users';
import { UpdateUserDTO } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@hooks/useAuth';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  contactPreference: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      instagram: '',
      contactPreference: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        email: user.email ?? '',
        whatsapp: user.whatsapp ?? '',
        instagram: user.instagram ?? '',
        contactPreference: user.contactPreference ?? '',
        address: user.address ?? '',
        latitude: user.latitude ?? undefined,
        longitude: user.longitude ?? undefined,
      });
    }
  }, [user, reset]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (address) {
        const formattedAddress = [
          address.street,
          address.district,
          address.city,
          address.region
        ].filter(Boolean).join(', ');

        setValue('address', formattedAddress);
        setValue('latitude', latitude);
        setValue('longitude', longitude);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLoadingLocation(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const updateData: UpdateUserDTO = {
        ...data,
      };
      await usersService.update(updateData);
      showToast.success('Sucesso', 'Perfil atualizado com sucesso');
      router.back();
    } catch (error) {
      showToast.error('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container edges={['top']}>
      <Header title="Editar Perfil" showBackButton />
      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(user?.name || '')}
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Digite seu nome"
                      autoCapitalize="words"
                    />
                  )}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Digite seu e-mail"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contato</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>WhatsApp</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="logo-whatsapp" size={20} color="#666" style={styles.inputIcon} />
                <Controller
                  control={control}
                  name="whatsapp"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.whatsapp && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="(00) 00000-0000"
                      keyboardType="phone-pad"
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instagram</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="logo-instagram" size={20} color="#666" style={styles.inputIcon} />
                <Controller
                  control={control}
                  name="instagram"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.instagram && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="@seu_usuario"
                      autoCapitalize="none"
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferência de Contato</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="chatbubble" size={20} color="#666" style={styles.inputIcon} />
                <Controller
                  control={control}
                  name="contactPreference"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.contactPreference && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Ex: WhatsApp, Instagram, etc."
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Localização</Text>
            <TouchableOpacity
              style={[styles.locationButton, loadingLocation && styles.locationButtonDisabled]}
              onPress={getCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="location" size={24} color="#fff" />
                  <Text style={styles.locationButtonText}>Usar minha localização</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="home" size={20} color="#666" style={styles.inputIcon} />
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.address && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Seu endereço completo"
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 