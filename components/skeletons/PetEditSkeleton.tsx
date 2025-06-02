import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseSkeleton } from './BaseSkeleton';

export function PetEditSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <BaseSkeleton height="100%" borderRadius={0} />
      </View>
      <View style={styles.form}>
        {/* Nome */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Tipo */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Raça */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Idade */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Gênero */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Tamanho */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={100} borderRadius={8} />
        </View>

        {/* Localização */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.label} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Checkboxes */}
        <View style={styles.checkboxContainer}>
          <BaseSkeleton width={24} height={24} borderRadius={4} />
          <BaseSkeleton width={24} height={24} borderRadius={4} />
        </View>

        {/* Botão de Submit */}
        <BaseSkeleton height={56} borderRadius={8} style={styles.submitButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
}); 