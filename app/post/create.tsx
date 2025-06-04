import { PostForm, CreatePostFormData } from '@/components/PostForm';
import { PostEditSkeleton } from '@/components/skeletons/PostEditSkeleton';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { postsService } from '@services/posts';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePost() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      setLoading(true);
      const location = `${data.district}, ${data.city}, ${data.state}`;
      await postsService.create({
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
      showToast.success('Sucesso', 'Post criado com sucesso');
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar post';
      showToast.error('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
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
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <PostForm onSubmit={onSubmit} submitLabel="Criar Post" />
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
});
