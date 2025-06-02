import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { PetGender, PetSize } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const typeOptions = [
  { label: 'Cachorro', value: 'DOG', icon: 'paw' },
  { label: 'Gato', value: 'CAT', icon: 'paw' },
];

const ageOptions = [
  { label: 'Filhote', value: 'PUPPY', icon: 'heart' },
  { label: 'Jovem', value: 'YOUNG', icon: 'leaf' },
  { label: 'Adulto', value: 'ADULT', icon: 'person' },
  { label: 'Idoso', value: 'SENIOR', icon: 'time' },
];

const sizeOptions = [
  { label: 'Pequeno', value: PetSize.SMALL, icon: 'resize' },
  { label: 'Médio', value: PetSize.MEDIUM, icon: 'resize' },
  { label: 'Grande', value: PetSize.LARGE, icon: 'resize' },
];

const genderOptions = [
  { label: 'Macho', value: PetGender.MALE, icon: 'male' },
  { label: 'Fêmea', value: PetGender.FEMALE, icon: 'female' },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const handleSearch = () => {
    // TODO: Implementar busca
    showToast.info('Info', 'Funcionalidade em desenvolvimento');
  };

  const renderFilterButton = (
    label: string,
    value: string,
    selectedValue: string,
    onPress: (value: string) => void,
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Busca Avançada" />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, raça..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Pet</Text>
          <View style={styles.optionsContainer}>
            {typeOptions.map((option) => (
              <View key={`type-${option.value}`} style={styles.optionWrapper}>
                {renderFilterButton(
                  option.label,
                  option.value,
                  selectedType,
                  setSelectedType,
                  option.icon
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idade</Text>
          <View style={styles.optionsContainer}>
            {ageOptions.map((option) => (
              <View key={`age-${option.value}`} style={styles.optionWrapper}>
                {renderFilterButton(
                  option.label,
                  option.value,
                  selectedAge,
                  setSelectedAge,
                  option.icon
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Porte</Text>
          <View style={styles.optionsContainer}>
            {sizeOptions.map((option) => (
              <View key={`size-${option.value}`} style={styles.optionWrapper}>
                {renderFilterButton(
                  option.label,
                  option.value,
                  selectedSize,
                  setSelectedSize,
                  option.icon
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gênero</Text>
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <View key={`gender-${option.value}`} style={styles.optionWrapper}>
                {renderFilterButton(
                  option.label,
                  option.value,
                  selectedGender,
                  setSelectedGender,
                  option.icon
                )}
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSearch}
        >
          <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Buscar</Text>
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
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 