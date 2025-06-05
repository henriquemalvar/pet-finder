import { showToast } from '@/components/ui/Toast';
import { Pet, PetGender, PetSize, PetType } from '@/types/database';
import { getPetGenderLabel, getPetSizeLabel, getPetTypeLabel } from '@/utils/pet';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const petSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(PetType),
  breed: z.string().min(1, 'Raça é obrigatória'),
  age: z.string().min(1, 'Idade é obrigatória'),
  gender: z.nativeEnum(PetGender),
  size: z.nativeEnum(PetSize),
  description: z.string().min(1, 'Descrição é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  castrated: z.boolean(),
  vaccinated: z.boolean(),
});

type PetFormData = z.infer<typeof petSchema>;

interface PetFormProps {
  initialData?: Partial<Pet>;
  onSubmit: (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>) => Promise<void>;
  submitLabel?: string;
}

export function PetForm({ initialData, onSubmit, submitLabel = 'Cadastrar' }: PetFormProps) {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: (initialData?.type || PetType.DOG) as PetType,
      breed: initialData?.breed || '',
      age: initialData?.age || '',
      gender: initialData?.gender || PetGender.MALE,
      size: initialData?.size || PetSize.MEDIUM,
      description: initialData?.description || '',
      location: initialData?.location || '',
      castrated: initialData?.castrated || false,
      vaccinated: initialData?.vaccinated || false,
    },
  });

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast.error('Erro', 'Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (address) {
        const locationParts = [
          address.district,
          address.city,
          address.region
        ].filter(Boolean);

        const locationString = locationParts.join(', ');
        setValue('location', locationString);
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleImagePick = async () => {
    try {
      return new Promise<ImagePicker.ImagePickerAsset | null>((resolve) => {
        Alert.alert(
          'Selecionar Imagem',
          'Escolha a origem da imagem',
          [
            {
              text: 'Câmera',
              onPress: async () => {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  showToast.error('Erro', 'Permissão da câmera negada');
                  resolve(null);
                  return;
                }
                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.8,
                });
                if (!result.canceled) {
                  resolve(result.assets[0]);
                } else {
                  resolve(null);
                }
              }
            },
            {
              text: 'Galeria',
              onPress: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.8,
                });
                if (!result.canceled) {
                  resolve(result.assets[0]);
                } else {
                  resolve(null);
                }
              }
            },
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => resolve(null)
            }
          ]
        );
      });
    } catch (error) {
      showToast.error('Erro', 'Não foi possível selecionar a imagem');
      return null;
    }
  };

  const handleFormSubmit = async (data: PetFormData) => {
    await onSubmit({
      ...data as Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>,
      image: selectedImage?.uri
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage.uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <MaterialCommunityIcons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={async () => {
                  const image = await handleImagePick();
                  if (image) {
                    setSelectedImage(image);
                  }
                }}
              >
                <MaterialCommunityIcons name="camera-plus" size={32} color="#007AFF" />
                <Text style={styles.addImageText}>Adicionar foto</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nome do pet"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo</Text>
              <View style={styles.typeContainer}>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, value } }) => (
                    <React.Fragment>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetType.DOG && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetType.DOG)}
                      >
                        <Ionicons
                          name="paw"
                          size={24}
                          color={value === PetType.DOG ? '#fff' : '#666'}
                        />
                        <Text style={[
                          styles.typeButtonText,
                          value === PetType.DOG && styles.typeButtonTextSelected
                        ]}>
                          {getPetTypeLabel(PetType.DOG)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetType.CAT && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetType.CAT)}
                      >
                        <Ionicons
                          name="paw"
                          size={24}
                          color={value === PetType.CAT ? '#fff' : '#666'}
                        />
                        <Text style={[
                          styles.typeButtonText,
                          value === PetType.CAT && styles.typeButtonTextSelected
                        ]}>
                          {getPetTypeLabel(PetType.CAT)}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  )}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Raça</Text>
              <Controller
                control={control}
                name="breed"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Raça do pet"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.breed && (
                <Text style={styles.errorText}>{errors.breed.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Idade</Text>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Idade do pet"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.age && (
                <Text style={styles.errorText}>{errors.age.message}</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gênero</Text>
              <View style={styles.typeContainer}>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, value } }) => (
                    <React.Fragment>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetGender.MALE && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetGender.MALE)}
                      >
                        <Ionicons
                          name="male"
                          size={24}
                          color={value === PetGender.MALE ? '#fff' : '#666'}
                        />
                        <Text style={[
                          styles.typeButtonText,
                          value === PetGender.MALE && styles.typeButtonTextSelected
                        ]}>
                          {getPetGenderLabel(PetGender.MALE)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetGender.FEMALE && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetGender.FEMALE)}
                      >
                        <Ionicons
                          name="female"
                          size={24}
                          color={value === PetGender.FEMALE ? '#fff' : '#666'}
                        />
                        <Text style={[
                          styles.typeButtonText,
                          value === PetGender.FEMALE && styles.typeButtonTextSelected
                        ]}>
                          {getPetGenderLabel(PetGender.FEMALE)}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  )}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Porte</Text>
              <View style={styles.typeContainer}>
                <Controller
                  control={control}
                  name="size"
                  render={({ field: { onChange, value } }) => (
                    <React.Fragment>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetSize.SMALL && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetSize.SMALL)}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          value === PetSize.SMALL && styles.typeButtonTextSelected
                        ]}>
                          {getPetSizeLabel(PetSize.SMALL)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetSize.MEDIUM && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetSize.MEDIUM)}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          value === PetSize.MEDIUM && styles.typeButtonTextSelected
                        ]}>
                          {getPetSizeLabel(PetSize.MEDIUM)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          value === PetSize.LARGE && styles.typeButtonSelected
                        ]}
                        onPress={() => onChange(PetSize.LARGE)}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          value === PetSize.LARGE && styles.typeButtonTextSelected
                        ]}>
                          {getPetSizeLabel(PetSize.LARGE)}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  )}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Adicionais</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descreva seu pet"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
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
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Cidade do pet"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                <Controller
                  control={control}
                  name="castrated"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => onChange(!value)}
                    >
                      <Ionicons
                        name={value ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={24}
                        color={value ? '#4CAF50' : '#666'}
                      />
                      <Text style={styles.statusText}>Castrado</Text>
                    </TouchableOpacity>
                  )}
                />
                <Controller
                  control={control}
                  name="vaccinated"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => onChange(!value)}
                    >
                      <Ionicons
                        name={value ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={24}
                        color={value ? '#4CAF50' : '#666'}
                      />
                      <Text style={styles.statusText}>Vacinado</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Salvando...' : submitLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    padding: 16,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  addImageButton: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addImageText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
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
}); 