import { PetListTile } from '@/components/PetListTile';
import { Container } from '@/components/ui/Container';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { postsService } from '@/services/postsService';
import { uploadService } from '@/services/uploadService';
import { Pet, PostType } from '@/types/database';
import { ESTADOS } from '@/utils/estados';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const postSchema = z.object({
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

type PostFormData = z.infer<typeof postSchema>;

const typeOptions = [
  { label: 'Adoção', value: PostType.ADOPTION, icon: 'heart' },
  { label: 'Perdido', value: PostType.LOST, icon: 'search' },
  { label: 'Encontrado', value: PostType.FOUND, icon: 'paw' },
];

export default function CreatePost() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingPets, setLoadingPets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      petId: '',
      type: PostType.ADOPTION,
      district: '',
      city: '',
      state: '',
      title: '',
      description: '',
      contact: '',
      latitude: undefined,
      longitude: undefined,
    }
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar pets';
      setError(errorMessage);
      showToast.error('Erro', errorMessage);
    } finally {
      setLoadingPets(false);
    }
  }, [user?.id]);

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
        longitude
      });

      if (address) {
        setValue('district', address.district || '');
        setValue('city', address.city || '');

        // Encontrar a sigla do estado pelo nome
        const estado = ESTADOS.find(e =>
          e.nome.toLowerCase() === address.region?.toLowerCase()
        );
        setValue('state', estado?.sigla || '');

        // Salvar as coordenadas
        setValue('latitude', latitude);
        setValue('longitude', longitude);
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLoadingLocation(false);
    }
  }, [setValue]);

  useEffect(() => {
    if (user?.id) {
      loadPets();
    }
  }, [user?.id, loadPets]);

  const handleCreatePet = () => {
    router.push('/pet/create');
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        setSelectedImages(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível selecionar as imagens');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      setLoading(true);
      const location = `${data.district}, ${data.city}, ${data.state}`;

      // Criar o post
      const post = await postsService.create({
        petId: data.petId,
        type: data.type,
        location,
        title: data.title,
        content: data.description,
        description: data.description,
        contact: data.contact,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      // Fazer upload das imagens
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        await uploadService.uploadFile(formData);
      }

      showToast.success('Sucesso', 'Post criado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar post';
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo do Post</Text>
              <View style={styles.optionsContainer}>
                {typeOptions.map((option) => (
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
              {errors.type && (
                <Text style={styles.errorText}>{errors.type.message}</Text>
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
                      <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                  ) : error ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadPets}
                      >
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
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                          colors={['#007AFF']}
                          tintColor="#007AFF"
                        />
                      }
                    >
                      {pets.map((pet) => {
                        return (
                          <Controller
                            key={pet.id}
                            control={control}
                            name="petId"
                            render={({ field: { onChange, value } }) => {
                              return (
                                <PetListTile
                                  pet={pet}
                                  showActions={false}
                                  disableNavigation={true}
                                  selected={value === pet.id}
                                  onPress={() => {
                                    if (value === pet.id) {
                                      onChange('');
                                    } else {
                                      onChange(pet.id);
                                    }
                                  }}
                                />
                              );
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              </View>
              {errors.petId && (
                <Text style={styles.errorText}>{errors.petId.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Título</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Título do post"
                    placeholderTextColor="#999"
                  />
                )}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Descreva o que você está procurando..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description.message}</Text>
              )}
            </View>

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
                          style={[styles.input, errors.district && styles.inputError]}
                          value={value}
                          onChangeText={onChange}
                          placeholder="Bairro"
                          placeholderTextColor="#999"
                        />
                      )}
                    />
                    {errors.district && (
                      <Text style={styles.errorText}>{errors.district.message}</Text>
                    )}
                  </View>

                  <View style={[styles.addressField, { flex: 2 }]}>
                    <Text style={styles.label}>Cidade</Text>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={[styles.input, errors.city && styles.inputError]}
                          value={value}
                          onChangeText={onChange}
                          placeholder="Cidade"
                          placeholderTextColor="#999"
                        />
                      )}
                    />
                    {errors.city && (
                      <Text style={styles.errorText}>{errors.city.message}</Text>
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
                            style={[styles.select, errors.state && styles.inputError]}
                            onPress={() => setShowStateModal(true)}
                          >
                            <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
                              {value || 'UF'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                    {errors.state && (
                      <Text style={styles.errorText}>{errors.state.message}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contato</Text>
              <Controller
                control={control}
                name="contact"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.contact && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="WhatsApp, email ou telefone"
                    placeholderTextColor="#999"
                  />
                )}
              />
              {errors.contact && (
                <Text style={styles.errorText}>{errors.contact.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fotos</Text>
              <View style={styles.imagesContainer}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.image}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedImages.length < 5 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handleImagePick}
                  >
                    <Ionicons name="add" size={32} color="#007AFF" />
                    <Text style={styles.addImageText}>Adicionar foto</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Criando...' : 'Criar Post'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de seleção de estado */}
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
    </Container>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
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
  petOption: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  petOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addImageText: {
    color: '#007AFF',
    fontSize: 12,
    textAlign: 'center',
  },
}); 