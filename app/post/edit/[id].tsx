import { PostForm, EditPostFormData } from '@/components/PostForm';
import { PostEditSkeleton } from '@/components/skeletons/PostEditSkeleton';
import { Header } from '@/components/ui/Header';
import { showToast } from '@/components/ui/Toast';
import { Post as DatabasePost } from '@/types/database';
import { postsService } from '@services/posts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditPost() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<EditPostFormData | null>(null);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const post = (await postsService.getById(id)) as unknown as DatabasePost;
      setInitialData({
        petId: post.petId,
        type: post.type,
        location: post.location,
        title: post.title,
        description: post.content,
        contact: post.user.contactPreference || '',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar post';
      showToast.error('Erro', errorMessage);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id, loadPost]);

  const onSubmit = async (data: EditPostFormData) => {
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

  if (loading || !initialData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Editar Post" showBackButton />
        <PostEditSkeleton />
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
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <PostForm
            onSubmit={onSubmit}
            initialValues={initialData}
            submitLabel="Salvar Alterações"
            simpleLocation
          />
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
