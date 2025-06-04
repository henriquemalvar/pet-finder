import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';

interface MenuItemProps {
  leftIcon: string;
  label: string;
  onPress?: () => void;
  rightIcon?: string;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  leftIconColor?: string;
  rightIconColor?: string;
}

export function MenuItem({
  leftIcon,
  label,
  onPress,
  rightIcon,
  rightComponent,
  style,
  labelStyle,
  leftIconColor = '#1a1a1a',
  rightIconColor = '#666',
}: MenuItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={[styles.menuItem, style]} onPress={onPress as any} disabled={!onPress}>
      <Ionicons name={leftIcon as any} size={24} color={leftIconColor} />
      <Text style={[styles.menuText, labelStyle]}>{label}</Text>
      {rightComponent}
      {rightIcon && <Ionicons name={rightIcon as any} size={24} color={rightIconColor} />}
    </Container>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
});
