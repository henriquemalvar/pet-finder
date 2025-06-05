import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

export function FAB({ onPress, icon = 'plus', color = '#3CB371' }: FABProps) {
  return (
    <TouchableOpacity style={[styles.fab, { backgroundColor: color }]} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 