import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseSkeleton } from './BaseSkeleton';

interface ListSkeletonProps {
  variant?: 'post' | 'pet';
  count?: number;
}

export function ListSkeleton({ variant = 'post', count = 3 }: ListSkeletonProps) {
  return (
    <View style={styles.container}>
      {[...Array(count)].map((_, index) => (
        <View key={index} style={[
          styles.card,
          variant === 'pet' && styles.petCard
        ]}>
          {variant === 'post' ? (
            <>
              <BaseSkeleton height={200} borderRadius={0} />
              <View style={styles.postInfo}>
                <BaseSkeleton width="60%" height={24} style={styles.postTitle} />
                <BaseSkeleton height={40} style={styles.postDescription} />
                <View style={styles.postMetadata}>
                  <BaseSkeleton width="30%" height={16} />
                  <BaseSkeleton width="40%" height={16} />
                </View>
              </View>
            </>
          ) : (
            <>
              <BaseSkeleton width={60} height={60} borderRadius={30} style={styles.petImage} />
              <View style={styles.petInfo}>
                <BaseSkeleton width="60%" height={20} style={styles.petName} />
                <BaseSkeleton width="40%" height={16} style={styles.petBreed} />
                <BaseSkeleton width="30%" height={14} style={styles.petInfo} />
              </View>
              <BaseSkeleton width={24} height={24} borderRadius={12} style={styles.chevron} />
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  postInfo: {
    padding: 16,
  },
  postTitle: {
    marginBottom: 8,
  },
  postDescription: {
    marginBottom: 12,
  },
  postMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petImage: {
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    marginBottom: 4,
  },
  petBreed: {
    marginBottom: 2,
  },
  chevron: {
    width: 24,
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 12,
  },
}); 