import { PetListTile } from '@/components/PetListTile';
import { ActivityIndicator } from 'react-native';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { Post as DatabasePost, Pet, PostType } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@hooks/useAuth';
import { petsService } from '@services/pets';
import { postsService } from '@services/posts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const postSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet'),
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

export default function EditPost() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingPets, setLoadingPets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<PostFormData>({
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

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const post = await postsService.getById(id) as unknown as DatabasePost;
      setValue('petId', post.petId);
      setValue('type', post.type);
      setValue('location', post.location);
      setValue('title', post.title);
      setValue('description', post.content);
      setValue('contact', post.user.contactPreference || '');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar post';
      showToast.error('Erro', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, setValue, router]);

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

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id, loadPost]);

  useEffect(() => {
    loadPets();
    loadPost();
  }, [loadPets, loadPost]);

  const handleCreatePet = () => {
    router.push('/pet/create');
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      setLoading(true);
      await postsService.update(id, {
        type: data.type,
        location: data.location,
        status: 'ACTIVE',
      });
      showToast.success('Sucesso', 'Post atualizado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar post';
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
        <Header title="Editar Post" showBackButton />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Editar Post" showBackButton />
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
                      {pets.map((pet) => (
                        <Controller
                          key={pet.id}
                          control={control}
                          name="petId"
                          render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                              style={[
                                styles.petOption,
                                value === pet.id && styles.petOptionSelected,
                              ]}
                              onPress={() => onChange(pet.id)}
                            >
                              <PetListTile
                                pet={pet}
                                showActions={false}
                                disableNavigation={true}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
                {errors.petId && (
                  <Text style={styles.errorText}>{errors.petId.message}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Localização</Text>
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Digite a localização"
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
              <Text style={styles.label}>Título</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o título"
                    value={value}
                    onChangeText={onChange}
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
                    style={[styles.input, styles.textArea]}
                    placeholder="Digite a descrição"
                    value={value}
                    onChangeText={onChange}
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
              <Text style={styles.label}>Contato</Text>
              <Controller
                control={control}
                name="contact"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o contato"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.contact && (
                <Text style={styles.errorText}>{errors.contact.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  optionTextSelected: {
    color: '#fff',
  },
  petsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  createPetButton: {
    marginBottom: 16,
    borderStyle: 'dashed',
  },
  createPetText: {
    color: '#007AFF',
    fontSize: 16,
  },
  petsListContainer: {
    maxHeight: 300,
  },
  petsList: {
    maxHeight: 300,
  },
  petsListContent: {
    gap: 8,
  },
  petOption: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  petOptionSelected: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  retryButton: {
    marginTop: 8,
    padding: 8,
  },
  retryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 