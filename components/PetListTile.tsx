import { Pet } from '@/types/database';
import { getPetGenderLabel, getPetSizeLabel, getPetTypeLabel } from '@/utils/pet';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, Menu } from 'react-native-paper';

interface PetListTileProps {
  pet: Pet;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPress?: () => void;
  disableNavigation?: boolean;
  selected?: boolean;
}

export function PetListTile({ 
  pet, 
  showActions = false, 
  onEdit, 
  onDelete,
  onPress,
  disableNavigation = false,
  selected = false
}: PetListTileProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!disableNavigation) {
      router.push(`/pet/${pet.id}`);
    }
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMenuVisible(true);
  };

  const handleMenuDismiss = () => {
    setMenuVisible(false);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit?.(pet.id);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    onDelete?.(pet.id);
  };

  return (
    <View style={[styles.container, selected && styles.containerSelected]}>
      <TouchableOpacity 
        style={styles.touchable}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        delayLongPress={200}
      >
        <View style={styles.imageContainer}>
          <Image
            source={pet.image ? { uri: pet.image } : require('@assets/images/default-dog.png')}
            style={styles.image}
          />
          {selected && (
            <View style={styles.checkContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{pet.name}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getPetTypeLabel(pet.type)}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getPetGenderLabel(pet.gender)}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.details}>
            {pet.breed} • {pet.age} • {getPetSizeLabel(pet.size)}
          </Text>
          <View style={styles.footer}>
            <View style={styles.status}>
              {pet.castrated && (
                <View style={styles.statusItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.statusText}>Castrado</Text>
                </View>
              )}
              {pet.vaccinated && (
                <View style={styles.statusItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.statusText}>Vacinado</Text>
                </View>
              )}
            </View>
            {showActions && (
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => onEdit?.(pet.id)}
                >
                  <Ionicons name="pencil" size={14} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => onDelete?.(pet.id)}
                >
                  <Ionicons name="trash" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <Menu
        visible={menuVisible}
        onDismiss={handleMenuDismiss}
        anchor={<View />}
        contentStyle={styles.menuContent}
      >
        <Menu.Item 
          onPress={handleEdit} 
          title="Editar" 
          leadingIcon="pencil"
        />
        <Divider />
        <Menu.Item 
          onPress={handleDelete} 
          title="Excluir" 
          leadingIcon="delete"
          titleStyle={styles.deleteText}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    minHeight: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  touchable: {
    flexDirection: 'row',
    flex: 1,
  },
  containerSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  checkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  details: {
    fontSize: 12,
    color: '#666',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteText: {
    color: '#FF3B30',
  },
}); 