import { PetImage } from '@/components/PetImage';
import { showToast } from '@/components/ui/Toast';
import { petsService } from '@/services/petsService';
import { Pet, PetGender, PetSize, PetType } from '@/types/database';
import { getPetGenderLabel, getPetSizeLabel, getPetTypeLabel } from '@/utils/pet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PetDetails() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPet = useCallback(async () => {
    try {
      if (!id) return;
      const data = await petsService.getById(id);
      const petData = {
        ...data,
        type: data.type as PetType
      };
      setPet(petData);
      
      // Atualizar o título da tela com o nome do pet
      router.setParams({ name: petData.name });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar pet';
      showToast.error('Erro', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) {
      setError('ID do pet não encontrado');
      setLoading(false);
      return;
    }

    loadPet();
  }, [id, loadPet]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Pet não encontrado'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.imageWrapper}>
          <PetImage pet={pet} />
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="close" size={28} color="#222" />
          </TouchableOpacity>
          <View style={styles.typeBadge}>
            <MaterialCommunityIcons name="paw" size={16} color="#fff" />
            <Text style={styles.typeBadgeText}>{getPetTypeLabel(pet.type as PetType)}</Text>
          </View>
        </View>
        <Text style={styles.petName}>{pet.name}</Text>
        <View style={styles.headerRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{pet.breed}</Text></View>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="paw" size={22} color="#888" />
            <Text style={styles.infoLabel}>Raça</Text>
            <Text style={styles.infoValue}>{pet.breed}</Text>
          </View>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="calendar" size={22} color="#888" />
            <Text style={styles.infoLabel}>Idade</Text>
            <Text style={styles.infoValue}>{pet.age}</Text>
          </View>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name={pet.gender === 'MALE' ? 'gender-male' : 'gender-female'} size={22} color="#888" />
            <Text style={styles.infoLabel}>Gênero</Text>
            <Text style={styles.infoValue}>{getPetGenderLabel(pet.gender as PetGender)}</Text>
          </View>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="arrow-expand-vertical" size={22} color="#888" />
            <Text style={styles.infoLabel}>Porte</Text>
            <Text style={styles.infoValue}>{getPetSizeLabel(pet.size as PetSize)}</Text>
          </View>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="map-marker" size={22} color="#888" />
            <Text style={styles.infoLabel}>Localização</Text>
            <Text style={styles.infoValue}>{pet.user?.address || 'Não informado'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.sectionText}>{pet.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <View style={styles.contactRow}>
            {pet.user?.whatsapp && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
                <Text style={styles.contactText}>{pet.user.whatsapp}</Text>
              </View>
            )}
            {pet.user?.instagram && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="instagram" size={22} color="#C13584" />
                <Text style={styles.contactText}>{pet.user.instagram}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 36,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
  },
  typeBadge: {
    position: 'absolute',
    left: 20,
    top: 36,
    backgroundColor: '#3CB371',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    elevation: 2,
  },
  typeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 18,
    marginBottom: 2,
    textAlign: 'left',
  },
  badge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#3CB371',
    fontWeight: '600',
    fontSize: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    paddingVertical: 18,
    marginBottom: 8,
    gap: 4,
  },
  infoLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
  infoValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    marginBottom: 6,
  },
  sectionText: {
    color: '#444',
    fontSize: 15,
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  contactText: {
    color: '#222',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 