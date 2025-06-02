import { PetListTile } from '@/components/PetListTile';
import { PetListTileSkeleton } from '@/components/skeletons/PetListTileSkeleton';
import { PostEditSkeleton } from '@/components/skeletons/PostEditSkeleton';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { Pet, PostType } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@hooks/useAuth';
import { petsService } from '@services/pets';
import { postsService } from '@services/posts';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const postSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet ou crie um novo'),
  type: z.nativeEnum(PostType),
  location: z.string().min(1, 'Localização é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  contact: z.string().min(1, 'Contato é obrigatório'),
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

  const { control, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      petId: '',
      type: PostType.ADOPTION,
      location: '',
      title: '',
      description: '',
      contact: '',
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

  useEffect(() => {
    if (user?.id) {
      loadPets();
    }
  }, [user?.id, loadPets]);

  const handleCreatePet = () => {
    router.push('/pet/create');
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      setLoading(true);
      await postsService.create({
        petId: data.petId,
        type: data.type,
        location: data.location,
        title: data.title,
        description: data.description,
        contact: data.contact,
      });
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
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Criar Post" showBackButton />
        <PostEditSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Criar Post" showBackButton />
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
                      <PetListTileSkeleton />
                      <PetListTileSkeleton />
                      <PetListTileSkeleton />
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
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.location && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Cidade, Estado"
                    placeholderTextColor="#999"
                  />
                )}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location.message}</Text>
              )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
}); 