import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseSkeleton } from './BaseSkeleton';

export function PostEditSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {/* Tipo do Post */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.labelSkeleton} />
          <View style={styles.optionsContainer}>
            <BaseSkeleton height={48} borderRadius={8} style={styles.optionButtonSkeleton} />
            <BaseSkeleton height={48} borderRadius={8} style={styles.optionButtonSkeleton} />
            <BaseSkeleton height={48} borderRadius={8} style={styles.optionButtonSkeleton} />
          </View>
        </View>

        {/* Seleção de Pet */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.labelSkeleton} />
          <View style={styles.petsSection}>
            <BaseSkeleton height={48} borderRadius={8} style={styles.createPetButtonSkeleton} />
            <View style={styles.petsListContainer}>
              <BaseSkeleton height={80} borderRadius={8} />
              <BaseSkeleton height={80} borderRadius={8} />
              <BaseSkeleton height={80} borderRadius={8} />
            </View>
          </View>
        </View>

        {/* Localização */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.labelSkeleton} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Título */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.labelSkeleton} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.labelSkeleton} />
          <BaseSkeleton height={100} borderRadius={8} />
        </View>

        {/* Contato */}
        <View style={styles.inputContainer}>
          <BaseSkeleton width="40%" height={20} style={styles.labelSkeleton} />
          <BaseSkeleton height={48} borderRadius={8} />
        </View>

        {/* Botão de Submit */}
        <BaseSkeleton height={56} borderRadius={8} style={styles.submitButtonSkeleton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelSkeleton: {
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButtonSkeleton: {
    flex: 1,
  },
  petsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  createPetButtonSkeleton: {
    marginBottom: 16,
  },
  petsListContainer: {
    gap: 8,
  },
  submitButtonSkeleton: {
    marginTop: 16,
  },
}); 