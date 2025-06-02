import { StyleSheet, View } from 'react-native';

export function PetListTileSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.name} />
          <View style={styles.badges}>
            <View style={styles.badge} />
            <View style={styles.badge} />
          </View>
        </View>
        <View style={styles.details} />
        <View style={styles.footer}>
          <View style={styles.status}>
            <View style={styles.statusItem} />
            <View style={styles.statusItem} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    backgroundColor: '#E1E9EE',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    width: '50%',
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    width: 50,
    height: 18,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  details: {
    width: '70%',
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    flexDirection: 'row',
    gap: 8,
  },
  statusItem: {
    width: 60,
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
}); 