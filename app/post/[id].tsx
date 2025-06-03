import { PostDetailsSkeleton } from '@/components/skeletons/PostDetailsSkeleton';
import { Header } from '@/components/ui/Header';
import { ImageHeader } from '@/components/ui/ImageHeader';
import { InfoGrid } from '@/components/ui/InfoGrid';
import { showToast } from '@/components/ui/Toast';
import { getPetGenderLabel, getPetSizeLabel, getPetTypeLabel, getPostTypeLabel } from '@/utils/pet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Post, postsService } from '@services/posts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Container } from '@/components/ui/Container';

export default function PostDetails() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    try {
      if (!id) return;
      const data = await postsService.getById(id);
      setPost(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar post';
      showToast.error('Erro', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) {
      setError('ID do post não encontrado');
      setLoading(false);
      return;
    }

    loadPost();
  }, [id, loadPost]);

  if (loading) {
    return (
      <Container edges={['top']}>
        <Header title="Detalhes do Post" showBackButton />
        <PostDetailsSkeleton />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container edges={['top']}>
        <Header title="Detalhes do Post" showBackButton />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Post não encontrado'}</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container edges={['top']}>
      <Header title="Detalhes do Post" showBackButton />
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        <ImageHeader
          imageUrl={post.pet.image}
          onClose={() => router.back()}
          badgeText={getPostTypeLabel(post.type)}
          badgeIcon="paw"
          badgeColor="#3CB371"
        />
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.petName}>{post.pet.name}</Text>
        <View style={styles.headerRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{getPetTypeLabel(post.pet.type)}</Text></View>
        </View>
        <InfoGrid
          items={[
            { icon: 'paw', label: 'Raça', value: post.pet.breed },
            { icon: 'calendar', label: 'Idade', value: `${post.pet.age} anos` },
            { icon: post.pet.gender === 'MALE' ? 'gender-male' : 'gender-female', label: 'Gênero', value: getPetGenderLabel(post.pet.gender) },
            { icon: 'arrow-expand-vertical', label: 'Porte', value: getPetSizeLabel(post.pet.size) },
            { icon: 'map-marker', label: 'Localização', value: post.location },
          ]}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          {post.content && <Text style={styles.sectionText}>{post.content}</Text>}
          {post.pet.description && <Text style={styles.sectionText}>{post.pet.description}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Adoção</Text>
          <View style={styles.adoptionInfoRow}>
            <MaterialCommunityIcons name="account" size={20} color="#888" />
            <Text style={styles.adoptionInfoText}>Responsável: {post.user.name}</Text>
          </View>
          <View style={styles.adoptionInfoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#888" />
            <Text style={styles.adoptionInfoText}>Localização: {post.location}</Text>
          </View>
          <View style={styles.adoptionInfoRow}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color="#888" />
            <Text style={styles.adoptionInfoText}>Publicado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}</Text>
          </View>
          <View style={styles.adoptionInfoRow}>
            <MaterialCommunityIcons name="check-circle" size={20} color={post.status === 'ACTIVE' ? '#4CAF50' : '#FF9800'} />
            <Text style={styles.adoptionInfoText}>Status: {post.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text>
          </View>
          <View style={styles.adoptionInfoRow}>
            <MaterialCommunityIcons name="needle" size={20} color="#888" />
            <Text style={styles.adoptionInfoText}>Castrado: {post.pet.castrated ? 'Sim' : 'Não'}</Text>
          </View>
          <View style={styles.adoptionInfoRow}>
            <MaterialCommunityIcons name="medical-bag" size={20} color="#888" />
            <Text style={styles.adoptionInfoText}>Vacinado: {post.pet.vaccinated ? 'Sim' : 'Não'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <View style={styles.contactRow}>
            {post.user.whatsapp && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
                <Text style={styles.contactText}>{post.user.whatsapp}</Text>
              </View>
            )}
            {post.user.instagram && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="instagram" size={22} color="#C13584" />
                <Text style={styles.contactText}>{post.user.instagram}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 18,
    marginBottom: 2,
    textAlign: 'left',
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3CB371',
    marginBottom: 8,
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
  adoptionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  adoptionInfoText: {
    color: '#333',
    fontSize: 15,
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
}); 