import { Pet, PetGender, PetSize, PetType } from '@/types/database';
import { getPetGenderLabel, getPetSizeLabel, getPetTypeLabel } from '@/utils/pet';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<PetFormData>({
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

  const handleFormSubmit = async (data: PetFormData) => {
    await onSubmit(data as Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'user' | 'posts'>);
  };

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
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
}); 