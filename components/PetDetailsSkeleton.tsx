import { StyleSheet, View } from 'react-native';

export function PetDetailsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.image} />
      <View style={styles.info}>
        <View style={styles.name} />
        <View style={styles.breed} />
        <View style={styles.age} />
        <View style={styles.description} />
        <View style={styles.description} />
        <View style={[styles.description, { width: '60%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E1E9EE',
  },
  info: {
    padding: 16,
  },
  name: {
    width: '70%',
    height: 32,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
  breed: {
    width: '50%',
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 4,
  },
  age: {
    width: '30%',
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 16,
  },
  description: {
    width: '100%',
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
}); 