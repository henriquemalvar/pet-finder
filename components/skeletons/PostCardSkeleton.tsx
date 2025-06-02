import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseSkeleton } from './BaseSkeleton';

interface PostCardSkeletonProps {
  showActions?: boolean;
}

export function PostCardSkeleton({ showActions = false }: PostCardSkeletonProps) {
  return (
    <View style={styles.container}>
      <BaseSkeleton height={200} borderRadius={8} />
      <View style={styles.content}>
        <View style={styles.header}>
          <BaseSkeleton width="60%" height={24} />
          <BaseSkeleton width="25%" height={20} />
        </View>
        <BaseSkeleton width="40%" height={20} style={styles.breedSkeleton} />
        <BaseSkeleton width="30%" height={16} style={styles.locationSkeleton} />
        <BaseSkeleton width="25%" height={14} style={styles.dateSkeleton} />
        {showActions && (
          <View style={styles.actionsSkeleton}>
            <BaseSkeleton width={80} height={32} borderRadius={6} />
            <BaseSkeleton width={80} height={32} borderRadius={6} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breedSkeleton: {
    marginBottom: 4,
  },
  locationSkeleton: {
    marginBottom: 4,
  },
  dateSkeleton: {
    marginBottom: 12,
  },
  actionsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
}); 