import { StyleSheet, View } from 'react-native';

export function PetListSkeleton() {
  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.petCard}>
          <View style={styles.petImage} />
          <View style={styles.petInfo}>
            <View style={styles.petName} />
            <View style={styles.petBreed} />
            <View style={styles.petAge} />
          </View>
          <View style={styles.chevron} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#E1E9EE',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    width: '60%',
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 4,
  },
  petBreed: {
    width: '40%',
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 2,
  },
  petAge: {
    width: '30%',
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  chevron: {
    width: 24,
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 12,
  },
}); 