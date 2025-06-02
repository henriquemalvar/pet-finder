import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseSkeleton } from './BaseSkeleton';

export function PostDetailsSkeleton() {
  return (
    <View style={styles.container}>
      <BaseSkeleton height={300} borderRadius={0} />
      <View style={styles.info}>
        <BaseSkeleton width="70%" height={32} style={styles.title} />
        <BaseSkeleton height={20} style={styles.description} />
        <BaseSkeleton height={20} style={styles.description} />
        <View style={styles.metadata}>
          <BaseSkeleton width="40%" height={16} style={styles.date} />
          <BaseSkeleton width="50%" height={16} />
        </View>
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
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 8,
  },
  metadata: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  date: {
    marginBottom: 8,
  },
}); 