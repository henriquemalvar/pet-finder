import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

type RoutePath = '/post/create' | '/pet/create';

interface HeaderProps {
  title: string;
  showAddButton?: boolean;
  addButtonLink?: RoutePath;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
  titleStyle?: ViewStyle;
  showBorder?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
}

export function Header({
  title,
  showAddButton = false,
  addButtonLink,
  showBackButton = false,
  onBackPress,
  rightComponent,
  transparent = false,
  style,
  titleStyle,
  showBorder = true,
  backgroundColor = '#fff',
  titleColor = '#1a1a1a',
  iconColor = '#1a1a1a',
}: HeaderProps) {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: transparent ? 'transparent' : backgroundColor },
        showBorder && !transparent && styles.border,
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
          <Text 
            style={[
              styles.title,
              { color: titleColor },
              titleStyle,
            ]} 
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {rightComponent}
          {showAddButton && (
            <Link href={addButtonLink || '/post/create'} asChild>
              <TouchableOpacity 
                style={styles.addButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    zIndex: 1,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Header; 