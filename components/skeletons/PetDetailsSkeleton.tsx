import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseSkeleton } from './BaseSkeleton';

export function PetDetailsSkeleton() {
  return (
    <View style={styles.container}>
      <BaseSkeleton height={300} borderRadius={0} />
      <View style={styles.info}>
        <BaseSkeleton width="70%" height={32} style={styles.name} />
        <BaseSkeleton width="50%" height={24} style={styles.breed} />
        <BaseSkeleton width="30%" height={20} style={styles.age} />
        <BaseSkeleton height={16} style={styles.description} />
        <BaseSkeleton height={16} style={styles.description} />
        <BaseSkeleton width="60%" height={16} style={styles.description} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  info: {
    padding: 16,
  },
  name: {
    marginBottom: 8,
  },
  breed: {
    marginBottom: 4,
  },
  age: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 8,
  },
}); 