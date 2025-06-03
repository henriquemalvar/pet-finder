import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { PostFilters, postsService } from '@/services/posts';
import { PetGender, PetSize } from '@/types/database';
import { ageOptions, genderOptions, petTypeOptions, sizeOptions, typeOptions, type PetTypeValue, type PostTypeValue } from '@/utils/filters';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const searchSchema = z.object({
  search: z.string(),
  type: z.enum(['LOST', 'FOUND', 'ADOPTION']).optional(),
  petType: z.enum(['DOG', 'CAT']).optional(),
  age: z.enum(['PUPPY', 'YOUNG', 'ADULT', 'SENIOR']).optional(),
  petSize: z.nativeEnum(PetSize).optional(),
  petGender: z.nativeEnum(PetGender).optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters?: string }>();
  const [loading, setLoading] = React.useState(false);

  const { control, handleSubmit, reset, watch } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: '',
      type: undefined,
      petType: undefined,
      age: undefined,
      petSize: undefined,
      petGender: undefined,
    },
  });

  useEffect(() => {
    if (params.filters) {
      try {
        const parsedFilters = JSON.parse(params.filters) as PostFilters;
        reset({
          search: parsedFilters.search || '',
          type: parsedFilters.type as PostTypeValue,
          petType: parsedFilters.petType as PetTypeValue,
          petSize: parsedFilters.petSize as PetSize,
          petGender: parsedFilters.petGender as PetGender,
        });
      } catch (error) {
        showToast.error('Erro', 'Filtros inválidos');
      }
    }
  }, [params.filters, reset]);

  const onSubmit = async (data: SearchFormData) => {
    try {
      setLoading(true);
      
      const filters: PostFilters = {
        type: data.type,
        status: 'ACTIVE',
        petType: data.petType,
        petGender: data.petGender,
        petSize: data.petSize,
        search: data.search || undefined,
      };

      const response = await postsService.list(filters);
      
      if (response.posts.length === 0) {
        showToast.error('Info', 'Nenhum resultado encontrado para sua busca.');
        return;
      }

      router.push({
        pathname: '/(tabs)',
        params: { filters: JSON.stringify(filters) }
      });
    } catch (error) {
      showToast.error('Erro', 'Não foi possível realizar a busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    reset();
  };

  const renderFilterButton = <T extends string>(
    label: string,
    value: T,
    selectedValue: T | undefined,
    onPress: (value: T) => void,
    icon?: string
  ) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedValue === value && styles.optionButtonSelected,
      ]}
      onPress={() => onPress(value)}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={selectedValue === value ? '#fff' : '#666'} 
          style={styles.optionIcon}
        />
      )}
      <Text
        style={[
          styles.optionText,
          selectedValue === value && styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const hasActiveFilters = Boolean(
    watch('search') ||
    watch('type') ||
    watch('petType') ||
    watch('age') ||
    watch('petSize') ||
    watch('petGender')
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Busca Avançada" 
        showBackButton
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <Controller
            control={control}
            name="search"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome, raça..."
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#999"
                returnKeyType="search"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Post</Text>
          <View style={styles.optionsContainer}>
            {typeOptions.map((option) => (
              <View key={`type-${option.value}`} style={styles.optionWrapper}>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, value } }) => (
                    renderFilterButton(
                      option.label,
                      option.value,
                      value,
                      onChange,
                      option.icon
                    )
                  )}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Pet</Text>
          <View style={styles.optionsContainer}>
            {petTypeOptions.map((option) => (
              <View key={`petType-${option.value}`} style={styles.optionWrapper}>
                <Controller
                  control={control}
                  name="petType"
                  render={({ field: { onChange, value } }) => (
                    renderFilterButton(
                      option.label,
                      option.value,
                      value,
                      onChange,
                      option.icon
                    )
                  )}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idade</Text>
          <View style={styles.optionsContainer}>
            {ageOptions.map((option) => (
              <View key={`age-${option.value}`} style={styles.optionWrapper}>
                <Controller
                  control={control}
                  name="age"
                  render={({ field: { onChange, value } }) => (
                    renderFilterButton(
                      option.label,
                      option.value,
                      value,
                      onChange,
                      option.icon
                    )
                  )}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Porte</Text>
          <View style={styles.optionsContainer}>
            {sizeOptions.map((option) => (
              <View key={`size-${option.value}`} style={styles.optionWrapper}>
                <Controller
                  control={control}
                  name="petSize"
                  render={({ field: { onChange, value } }) => (
                    renderFilterButton(
                      option.label,
                      option.value,
                      value,
                      onChange,
                      option.icon
                    )
                  )}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gênero</Text>
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <View key={`gender-${option.value}`} style={styles.optionWrapper}>
                <Controller
                  control={control}
                  name="petGender"
                  render={({ field: { onChange, value } }) => (
                    renderFilterButton(
                      option.label,
                      option.value,
                      value,
                      onChange,
                      option.icon
                    )
                  )}
                />
              </View>
            ))}
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
            <React.Fragment>
              <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Buscar</Text>
            </React.Fragment>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  contentContainer: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionWrapper: {
    flex: 1,
    minWidth: '45%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    gap: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionIcon: {
    marginRight: 4,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 