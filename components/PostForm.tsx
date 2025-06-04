import { PetListTile } from './PetListTile';
import { PetListTileSkeleton } from './skeletons/PetListTileSkeleton';
import { showToast } from './ui/Toast';
import { Pet, PostType } from '@/types/database';
import { ESTADOS } from '@/utils/estados';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@hooks/useAuth';
import { petsService } from '@services/pets';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const createPostSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet ou crie um novo'),
  type: z.nativeEnum(PostType),
  district: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const editPostSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet'),
  type: z.nativeEnum(PostType),
  location: z.string().min(1, 'Localização é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  contact: z.string().min(1, 'Contato é obrigatório'),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type EditPostFormData = z.infer<typeof editPostSchema>;
export type PostFormData = CreatePostFormData | EditPostFormData;

interface PostFormProps {
  initialValues?: Partial<CreatePostFormData & EditPostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel?: string;
  simpleLocation?: boolean;
}

export function PostForm({
  initialValues,
  onSubmit,
  submitLabel = 'Salvar',
  simpleLocation = false,
}: PostFormProps) {
  const { user } = useAuth();
  const [loadingPets, setLoadingPets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);

  const schema = simpleLocation ? editPostSchema : createPostSchema;

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<PostFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      petId: initialValues?.petId || '',
      type: (initialValues?.type || PostType.ADOPTION) as PostType,
      ...(simpleLocation
        ? { location: (initialValues as any)?.location || '' }
        : {
            district: (initialValues as any)?.district || '',
            city: (initialValues as any)?.city || '',
            state: (initialValues as any)?.state || '',
            latitude: (initialValues as any)?.latitude,
            longitude: (initialValues as any)?.longitude,
          }),
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      contact: initialValues?.contact || '',
    },
  });

  const loadPets = useCallback(async () => {
    try {
      setLoadingPets(true);
      setError(null);

      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const userPets = await petsService.getByUser(user.id);

      if (!Array.isArray(userPets)) {
        setPets([]);
        return;
      }

      const petsArray = userPets as unknown as Pet[];
      setPets(petsArray);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pets';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoadingPets(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadPets();
    }
  }, [user?.id, loadPets]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handleCreatePet = () => {
    router.push('/pet/create');
  };

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast.error('Erro', 'Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address) {
        setValue('district', address.district || '');
        setValue('city', address.city || '');

        const estado = ESTADOS.find(
          (e) => e.nome.toLowerCase() === address.region?.toLowerCase(),
        );
        setValue('state', estado?.sigla || '');

        setValue('latitude', latitude);
        setValue('longitude', longitude);
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLoadingLocation(false);
    }
  }, [setValue]);

  const handleFormSubmit = async (data: PostFormData) => {
    await onSubmit(data);
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipo do Post</Text>
        <View style={styles.optionsContainer}>
          {[{ label: 'Adoção', value: PostType.ADOPTION, icon: 'heart' },
            { label: 'Perdido', value: PostType.LOST, icon: 'search' },
            { label: 'Encontrado', value: PostType.FOUND, icon: 'paw' }].map((option) => (
            <Controller
              key={option.value}
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    value === option.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => onChange(option.value)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={value === option.value ? '#fff' : '#666'}
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>
        {'type' in errors && (
          <Text style={styles.errorText}>{(errors as any).type?.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Selecione um Pet</Text>
        <View style={styles.petsSection}>
          <TouchableOpacity
            style={[styles.optionButton, styles.createPetButton]}
            onPress={handleCreatePet}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" style={styles.optionIcon} />
            <Text style={styles.createPetText}>Adicionar Novo Pet</Text>
          </TouchableOpacity>

          <View style={styles.petsListContainer}>
            {loadingPets ? (
              <View style={styles.petsListContent}>
                <PetListTileSkeleton />
                <PetListTileSkeleton />
                <PetListTileSkeleton />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadPets}>
                  <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : !pets || pets.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Você ainda não tem pets cadastrados</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.petsList}
                contentContainerStyle={styles.petsListContent}
                showsVerticalScrollIndicator
                nestedScrollEnabled
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#007AFF"]}
                    tintColor="#007AFF"
                  />
                }
              >
                {pets.map((pet) => (
                  <Controller
                    key={pet.id}
                    control={control}
                    name="petId"
                    render={({ field: { onChange, value } }) => (
                      <PetListTile
                        pet={pet}
                        showActions={false}
                        disableNavigation
                        selected={value === pet.id}
                        onPress={() => {
                          if (value === pet.id) {
                            onChange('');
                          } else {
                            onChange(pet.id);
                          }
                        }}
                      />
                    )}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        {'petId' in errors && (
          <Text style={styles.errorText}>{(errors as any).petId?.message}</Text>
        )}
      </View>

      {simpleLocation ? (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Localização</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Digite a localização"
                value={value as string}
                onChangeText={onChange}
              />
            )}
          />
          {'location' in errors && (
            <Text style={styles.errorText}>{(errors as any).location?.message}</Text>
          )}
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Localização</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={[styles.locationButton, loadingLocation && styles.locationButtonDisabled]}
              onPress={getCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="location" size={24} color="#fff" />
              )}
            </TouchableOpacity>
            <Text style={styles.locationButtonText}>Usar minha localização</Text>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <View style={[styles.addressField, { flex: 2 }]}>
                <Text style={styles.label}>Bairro</Text>
                <Controller
                  control={control}
                  name="district"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, (errors as any).district && styles.inputError]}
                      value={value as string}
                      onChangeText={onChange}
                      placeholder="Bairro"
                      placeholderTextColor="#999"
                    />
                  )}
                />
                {'district' in errors && (
                  <Text style={styles.errorText}>{(errors as any).district?.message}</Text>
                )}
              </View>

              <View style={[styles.addressField, { flex: 2 }]}>
                <Text style={styles.label}>Cidade</Text>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, (errors as any).city && styles.inputError]}
                      value={value as string}
                      onChangeText={onChange}
                      placeholder="Cidade"
                      placeholderTextColor="#999"
                    />
                  )}
                />
                {'city' in errors && (
                  <Text style={styles.errorText}>{(errors as any).city?.message}</Text>
                )}
              </View>

              <View style={[styles.addressField, { flex: 1 }]}>
                <Text style={styles.label}>Estado</Text>
                <Controller
                  control={control}
                  name="state"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.selectContainer}>
                      <TouchableOpacity
                        style={[styles.select, (errors as any).state && styles.inputError]}
                        onPress={() => setShowStateModal(true)}
                      >
                        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
                          {value as string || 'UF'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {'state' in errors && (
                  <Text style={styles.errorText}>{(errors as any).state?.message}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, (errors as any).title && styles.inputError]}
              value={value as string}
              onChangeText={onChange}
              placeholder="Título do post"
              placeholderTextColor="#999"
            />
          )}
        />
        {'title' in errors && (
          <Text style={styles.errorText}>{(errors as any).title?.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, (errors as any).description && styles.inputError]}
              value={value as string}
              onChangeText={onChange}
              placeholder="Descreva o que você está procurando..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {'description' in errors && (
          <Text style={styles.errorText}>{(errors as any).description?.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contato</Text>
        <Controller
          control={control}
          name="contact"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, (errors as any).contact && styles.inputError]}
              value={value as string}
              onChangeText={onChange}
              placeholder="WhatsApp, email ou telefone"
              placeholderTextColor="#999"
            />
          )}
        />
        {'contact' in errors && (
          <Text style={styles.errorText}>{(errors as any).contact?.message}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(handleFormSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Text>
      </TouchableOpacity>

      {!simpleLocation && (
        <Modal
          visible={showStateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione o Estado</Text>
                <TouchableOpacity
                  onPress={() => setShowStateModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalList}>
                {ESTADOS.map((estado) => (
                  <TouchableOpacity
                    key={estado.sigla}
                    style={styles.modalItem}
                    onPress={() => {
                      setValue('state', estado.sigla);
                      setShowStateModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>
                      {estado.sigla} - {estado.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  optionIcon: {
    marginRight: 4,
  },
  petsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  petsListContainer: {
    height: 300,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  petsList: {
    flex: 1,
  },
  petsListContent: {
    padding: 16,
    gap: 8,
  },
  createPetButton: {
    margin: 16,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createPetText: {
    fontSize: 14,
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addressContainer: {
    gap: 16,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addressField: {
    gap: 8,
  },
  selectContainer: {
    position: 'relative',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  selectPlaceholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});
